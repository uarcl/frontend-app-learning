import React, { useContext }  from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';

import Footer from '@uarcl/frontend-component-footer-uar';
import { Toast } from '@edx/paragon';
import { LearningHeader as Header } from '@uarcl/frontend-component-header-uar';
import PageLoading from '../generic/PageLoading';
import { getAccessDeniedRedirectUrl } from '../shared/access';
import { useModel } from '../generic/model-store';

import genericMessages from '../generic/messages';
import messages from './messages';
import LoadedTabPage from './LoadedTabPage';
import { setCallToActionToast } from '../course-home/data/slice';
import LaunchCourseHomeTourButton from '../product-tours/newUserCourseHomeTour/LaunchCourseHomeTourButton';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import { AppContext } from '@edx/frontend-platform/react';
function TabPage({ intl, ...props }) {
  const {
    activeTabSlug,
    courseId,
    courseStatus,
    metadataModel,
  } = props;
  const {
    toastBodyLink,
    toastBodyText,
    toastHeader,
  } = useSelector(state => state.courseHome);
  const dispatch = useDispatch();
  const {
    courseAccess,
    number,
    org,
    start,
    title,
  } = useModel('courseHomeMeta', courseId);

  const { authenticatedUser } = useContext(AppContext);
  if (courseStatus === 'loading') {
    return (
      <>
        <Header 
          showUserDropdown={authenticatedUser?true:false}
        />
        <PageLoading
          srMessage={intl.formatMessage(messages.loading)}
        />
        <Footer />
      </>
    );
  }

  if (courseStatus === 'denied') {
    if (courseAccess.errorCode === 'authentication_required'){
      const redirectLogin = getLoginRedirectUrl(global.location.href);
      if(redirectLogin){
        window.location.replace(redirectLogin);
        return null;
      }
    }
    const redirectUrl = getAccessDeniedRedirectUrl(courseId, activeTabSlug, courseAccess, start);
    if (redirectUrl) {
      return (<Redirect to={redirectUrl} />);
    }
  }

  // Either a success state or a denied state that wasn't redirected above (some tabs handle denied states themselves,
  // like the outline tab handling unenrolled learners)
  if (courseStatus === 'loaded' || courseStatus === 'denied') {
    return (
      <>
        <Toast
          action={toastBodyText ? {
            label: toastBodyText,
            href: toastBodyLink,
          } : null}
          closeLabel={intl.formatMessage(genericMessages.close)}
          onClose={() => dispatch(setCallToActionToast({ header: '', link: null, link_text: null }))}
          show={!!(toastHeader)}
        >
          {toastHeader}
        </Toast>
        {metadataModel === 'courseHomeMeta' && (<LaunchCourseHomeTourButton srOnly />)}
        <Header
          courseOrg={org}
          courseNumber={number}
          courseTitle={title}
        />
        <LoadedTabPage {...props} />
        <Footer />
      </>
    );
  }

  // courseStatus 'failed' and any other unexpected course status.
  const redirectLogin = getLoginRedirectUrl(global.location.href);
  if(redirectLogin){
    window.location.replace(redirectLogin);
    return null;
  }
}

TabPage.defaultProps = {
  courseId: null,
  unitId: null,
};

TabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string,
  courseStatus: PropTypes.string.isRequired,
  metadataModel: PropTypes.string.isRequired,
  unitId: PropTypes.string,
};

export default injectIntl(TabPage);
