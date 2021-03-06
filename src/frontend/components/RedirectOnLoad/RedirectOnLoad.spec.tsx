import '../../testSetup';

import { shallow } from 'enzyme';
import * as React from 'react';

import { appState } from '../../types/AppData';
import { modelName } from '../../types/models';
import { uploadState } from '../../types/tracks';
import { DASHBOARD_ROUTE } from '../Dashboard/route';
import { ERROR_COMPONENT_ROUTE } from '../ErrorComponent/route';
import { UPLOAD_FORM_ROUTE } from '../UploadForm/route';
import { VIDEO_PLAYER_ROUTE } from '../VideoPlayer/route';
import { RedirectOnLoad } from './RedirectOnLoad';

describe('<RedirectOnLoad />', () => {
  it('redirects to the error view on LTI error', () => {
    const wrapper = shallow(
      <RedirectOnLoad ltiState={appState.ERROR} video={{} as any} />,
    );

    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(ERROR_COMPONENT_ROUTE('lti'));
  });

  it('redirects instructors to the player when the video is ready', () => {
    // The video is `is_ready_to_play` and READY
    let wrapper = shallow(
      <RedirectOnLoad
        ltiState={appState.INSTRUCTOR}
        video={
          { is_ready_to_play: true, upload_state: uploadState.READY } as any
        }
      />,
    );
    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(VIDEO_PLAYER_ROUTE());

    // The video is `is_ready_to_play` with a pending upload
    wrapper = shallow(
      <RedirectOnLoad
        ltiState={appState.INSTRUCTOR}
        video={
          { is_ready_to_play: true, upload_state: uploadState.PENDING } as any
        }
      />,
    );
    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(VIDEO_PLAYER_ROUTE());

    // The video is `is_ready_to_play` with an upload error
    wrapper = shallow(
      <RedirectOnLoad
        ltiState={appState.INSTRUCTOR}
        video={
          { is_ready_to_play: true, upload_state: uploadState.ERROR } as any
        }
      />,
    );
    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(VIDEO_PLAYER_ROUTE());
  });

  it('redirects students to /player when the video is ready', () => {
    // The video is `is_ready_to_play` and READY
    let wrapper = shallow(
      <RedirectOnLoad
        ltiState={appState.STUDENT}
        video={
          { is_ready_to_play: true, upload_state: uploadState.READY } as any
        }
      />,
    );
    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(VIDEO_PLAYER_ROUTE());

    // The video is `is_ready_to_play` with a pending upload
    wrapper = shallow(
      <RedirectOnLoad
        ltiState={appState.STUDENT}
        video={
          { is_ready_to_play: true, upload_state: uploadState.PENDING } as any
        }
      />,
    );
    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(VIDEO_PLAYER_ROUTE());

    // The video is `is_ready_to_play` with an upload error
    wrapper = shallow(
      <RedirectOnLoad
        ltiState={appState.STUDENT}
        video={
          { is_ready_to_play: true, upload_state: uploadState.ERROR } as any
        }
      />,
    );
    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(VIDEO_PLAYER_ROUTE());
  });

  it('redirects instructors to /form when there is no video yet', () => {
    const wrapper = shallow(
      <RedirectOnLoad
        ltiState={appState.INSTRUCTOR}
        video={
          {
            id: '42',
            is_ready_to_play: false,
            upload_state: uploadState.PENDING,
          } as any
        }
      />,
    );

    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(
      UPLOAD_FORM_ROUTE(modelName.VIDEOS, '42'),
    );
  });

  it('redirects instructors to /dashboard when there is a video undergoing processing', () => {
    const wrapper = shallow(
      <RedirectOnLoad
        ltiState={appState.INSTRUCTOR}
        video={
          {
            is_ready_to_play: false,
            upload_state: uploadState.PROCESSING,
          } as any
        }
      />,
    );

    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(DASHBOARD_ROUTE());
  });

  it('redirects students to the error view when the video is not ready', () => {
    const wrapper = shallow(
      <RedirectOnLoad
        ltiState={appState.STUDENT}
        video={
          {
            is_ready_to_play: false,
            upload_state: uploadState.PROCESSING,
          } as any
        }
      />,
    );

    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(ERROR_COMPONENT_ROUTE('notFound'));
  });

  it('redirects students to the error view when the video is null', () => {
    const wrapper = shallow(
      <RedirectOnLoad ltiState={appState.STUDENT} video={null} />,
    );

    expect(wrapper.name()).toEqual('Redirect');
    expect(wrapper.prop('push')).toBeTruthy();
    expect(wrapper.prop('to')).toEqual(ERROR_COMPONENT_ROUTE('notFound'));
  });
});
