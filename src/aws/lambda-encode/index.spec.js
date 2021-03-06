process.env.DISABLE_SSL_VALIDATION = 'false';

// Don't pollute tests with logs intended for CloudWatch
jest.spyOn(console, 'log');

// Mock our own sub-modules to simplify our tests
const mockEncodeTimedTextTrack = jest.fn();
jest.doMock('./src/encodeTimedTextTrack', () => mockEncodeTimedTextTrack);

const mockEncodeVideo = jest.fn();
jest.doMock('./src/encodeVideo', () => mockEncodeVideo);

const mockUpdateState = jest.fn();
jest.doMock('./src/updateState', () => mockUpdateState);

const lambda = require('./index.js').handler;

const callback = jest.fn();

describe('lambda', () => {
  beforeEach(() => {
    console.log.mockReset();
    jest.resetAllMocks();
  });

  it('reports a specific error when a video object key has an unexpected format', () => {
    lambda(
      {
        Records: [
          {
            s3: {
              bucket: { name: 'some bucket' },
              object: {
                key:
                  '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/video/dba1512e-d0b3-40cc-ae44-722fbe8cba6a',
              },
            },
          },
        ],
      },
      null,
      callback,
    );
    expect(mockUpdateState).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(
      'Source videos should be uploaded in a folder of the form "{playlist_id}/videos/{video_id}/{stamp}".',
    );
  });

  it('reports a specific error when a timed text object key has an unexpected format', () => {
    lambda(
      {
        Records: [
          {
            s3: {
              bucket: { name: 'some bucket' },
              object: {
                key:
                  '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/timedtexttrack/dba1512e-d0b3-40cc-ae44-722fbe8cba6a',
              },
            },
          },
        ],
      },
      null,
      callback,
    );
    expect(mockUpdateState).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(
      'Source timed text files should be uploaded to a folder of the form ' +
        '"{playlist_id}/timedtexttrack/{timedtext_id}/{stamp}_{language}[_{has_closed_caption}]".',
    );
  });

  it('reports an error when the kind of object is unexpected', () => {
    lambda(
      {
        Records: [
          {
            s3: {
              bucket: { name: 'some bucket' },
              object: {
                key:
                  '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/subtitletrack/dba1512e-d0b3-40cc-ae44-722fbe8cba6a',
              },
            },
          },
        ],
      },
      null,
      callback,
    );
    expect(mockUpdateState).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(
      'Unrecognized kind subtitletrack in key ' +
        '"630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/subtitletrack/dba1512e-d0b3-40cc-ae44-722fbe8cba6a".',
    );
  });

  it('reports an error when the object key has an unexpected format', () => {
    lambda(
      {
        Records: [
          {
            s3: {
              bucket: { name: 'some bucket' },
              object: { key: 'invalid key' },
            },
          },
        ],
      },
      null,
      callback,
    );
    expect(mockUpdateState).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(
      'Unrecognized key format "invalid key"',
    );
  });

  describe('called with a timed text object', () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'source bucket',
            },
            object: {
              key:
                '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/timedtexttrack/dba1512e-d0b3-40cc-ae44-722fbe8cba6a/1542967735_fr',
            },
          },
        },
      ],
    };

    it('delegates to encodeTimedTextTrack and calls updateState when it succeeds', async () => {
      await lambda(event, null, callback);

      expect(mockEncodeTimedTextTrack).toHaveBeenCalledWith(
        '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/timedtexttrack/dba1512e-d0b3-40cc-ae44-722fbe8cba6a/1542967735_fr',
        'source bucket',
      );
      expect(mockUpdateState).toHaveBeenCalledWith(
        '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/timedtexttrack/dba1512e-d0b3-40cc-ae44-722fbe8cba6a/1542967735_fr',
        'ready',
      );
    });

    it('delegates to encodeTimedTextTrack and reports the error when it fails', async () => {
      mockEncodeTimedTextTrack.mockImplementation(
        () => new Promise((resolve, reject) => reject('Failed!')),
      );

      await lambda(event, null, callback);

      expect(mockEncodeTimedTextTrack).toHaveBeenCalledWith(
        '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/timedtexttrack/dba1512e-d0b3-40cc-ae44-722fbe8cba6a/1542967735_fr',
        'source bucket',
      );
      expect(mockUpdateState).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith('Failed!');
    });
  });

  describe('called with a video object', () => {
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: 'source bucket',
            },
            object: {
              key:
                '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/video/dba1512e-d0b3-40cc-ae44-722fbe8cba6a/1542967735_fr',
            },
          },
        },
      ],
    };

    it('delegates to encodeVideo and calls updateState & callback when it succeeds', async () => {
      mockEncodeVideo.mockReturnValue(Promise.resolve({ Job: { Id: '42' } }));
      await lambda(event, null, callback);

      expect(mockEncodeVideo).toHaveBeenCalledWith(
        '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/video/dba1512e-d0b3-40cc-ae44-722fbe8cba6a/1542967735_fr',
        'source bucket',
      );
      expect(mockUpdateState).toHaveBeenCalledWith(
        '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/video/dba1512e-d0b3-40cc-ae44-722fbe8cba6a/1542967735_fr',
        'processing',
      );
    });

    it('delegates to encodeVideo and reports the error when it fails', async () => {
      mockEncodeVideo.mockImplementation(
        () => new Promise((resolve, reject) => reject('Failed!')),
      );

      await lambda(event, null, callback);

      expect(mockEncodeVideo).toHaveBeenCalledWith(
        '630dfaaa-8b1c-4d2e-b708-c9a2d715cf59/video/dba1512e-d0b3-40cc-ae44-722fbe8cba6a/1542967735_fr',
        'source bucket',
      );
      expect(mockUpdateState).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith('Failed!');
    });
  });
});
