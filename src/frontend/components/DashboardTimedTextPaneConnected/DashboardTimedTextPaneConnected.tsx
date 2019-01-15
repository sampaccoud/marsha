import { connect } from 'react-redux';

import { RootState } from '../../data/rootReducer';
import {
  DashboardTimedTextPane,
  DashboardTimedTextPaneProps,
} from '../DashboardTimedTextPane/DashboardTimedTextPane';

const mapStateToProps = (
  state: RootState,
  ownProps: DashboardTimedTextPaneProps,
) => ({
  ...ownProps,
  jwt: state.context.jwt,
});

export const DashboardTimedTextPaneConnected = connect(mapStateToProps)(
  DashboardTimedTextPane,
);
