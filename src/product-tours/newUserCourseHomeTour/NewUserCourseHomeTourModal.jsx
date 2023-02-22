import React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  ActionRow, Button, MarketingModal, ModalDialog,
} from '@edx/paragon';

import messages from '../messages';
import Logo from '../../assets/logo_uar.png';

function NewUserCourseHomeTourModal({
  intl,
  isOpen,
  onDismiss,
  onStartTour,
}) {
  return (
    <MarketingModal
      isOpen={isOpen}
      title="New user course home prompt"
      className="new-user-tour-dialog"
      heroIsDark
      hasCloseButton={false}
      heroNode={(
        <ModalDialog.Hero className="flex-column flex-md-row">
          <img src={Logo} className="mr-0 mr-md-3 hero-logo" />
          <ModalDialog.Hero.Content style={{ maxWidth: '20rem' }}>
            <ModalDialog.Title as="h2" className="text-primary">
              <FormattedMessage
                id="tours.newUserModal.title"
                defaultMessage="{welcome} course!"
                values={{
                  welcome: <span className="text-primary">{intl.formatMessage(messages.newUserModalTitleWelcome)}</span>,
                }}
              />
            </ModalDialog.Title>
          </ModalDialog.Hero.Content>
        </ModalDialog.Hero>
      )}
      footerNode={(
        <ActionRow>
          <Button
            variant="tertiary"
            onClick={onDismiss}
          >
            {intl.formatMessage(messages.skipForNow)}
          </Button>
          <Button
            variant="brand"
            onClick={onStartTour}
          >
            {intl.formatMessage(messages.beginTour)}
          </Button>
        </ActionRow>
      )}
      onClose={onDismiss}
    >
      <p className="text-dark-900">{intl.formatMessage(messages.newUserModalBody)}</p>
    </MarketingModal>
  );
}

NewUserCourseHomeTourModal.propTypes = {
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onStartTour: PropTypes.func.isRequired,
};

export default injectIntl(NewUserCourseHomeTourModal);
