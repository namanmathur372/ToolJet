import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from '@/_ui/LeftSidebar';
import { Alert } from '@/_ui/Alert';
import { EditInput } from './EditInput';
import { validateKebabCase } from '@/_helpers/utils';
import _ from 'lodash';
import useStore from '@/AppBuilder/_stores/store';

export const EditModal = ({ darkMode }) => {
  const editingPage = useStore((state) => state.editingPage);
  const updatePageHandle = useStore((state) => state.updatePageHandle);

  const [pageHandle, setPageHandle] = useState(page?.handle);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const page = editingPage;
  const windowUrl = window.location.href;
  const toggleEditPageHandleModal = useStore((state) => state.toggleEditPageHandleModal);
  const setResolvedPageConstants = useStore((state) => state.setResolvedPageConstants);
  const setCurrentPageHandle = useStore((state) => state.setCurrentPageHandle);
  const currentPageId = useStore((state) => state.currentPageId);

  const slug = windowUrl.split(page?.handle)[0];

  const show = useStore((state) => state.showRenamePageHandleModal);
  const handleClose = () => {
    toggleEditPageHandleModal(false);
  };

  React.useEffect(() => {
    setError(null);
  }, [show]);

  const handleSave = () => {
    if (pageHandle === page?.handle) {
      return handleClose();
    }
    const { isValid, error } = validateKebabCase(pageHandle);
    if (!isValid) {
      setError(error);
      return;
    }
    const transformedPageHandle = _.kebabCase(pageHandle);
    setIsSaving(true);
    updatePageHandle(page.id, transformedPageHandle);
    setResolvedPageConstants({
      handle: transformedPageHandle,
    });
    if (page.id === currentPageId) {
      setCurrentPageHandle(transformedPageHandle);
    }
    setTimeout(() => {
      setIsSaving(false);
    }, 900);
  };

  const handleCancel = () => {
    setError(null);
    setIsSaving(false);
    handleClose();
  };

  React.useEffect(() => {
    if (!show && pageHandle !== page?.handle) {
      setPageHandle(page?.handle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    setPageHandle(page?.handle);
  }, [page]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="sm"
      animation={false}
      centered
      className={`${darkMode && 'dark-theme'} page-handle-edit-modal `}
      backdrop="static"
      onClick={(event) => event.stopPropagation()}
    >
      <Modal.Header>
        <Modal.Title style={{ fontSize: '16px', fontWeight: '400' }} data-cy={'title-edit-page-handle'}>
          Edit page handle
        </Modal.Title>
        <span className="cursor-pointer" size="sm" onClick={() => handleClose()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-x"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-cy={'button-close'}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      </Modal.Header>
      <Modal.Body>
        <div className="page-handle-edit-container mb-4">
          <EditInput
            slug={slug}
            error={error}
            setError={setError}
            pageHandle={pageHandle}
            setPageHandle={setPageHandle}
            isSaving={isSaving}
          />
        </div>

        <div className="alert-container">
          <Alert svg="alert-info" cls="page-handler-alert" data-cy={`page-handle-alert-info`}>
            Changing the page handle will break any existing apps that are using this page.
          </Alert>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          darkMode={darkMode}
          onClick={handleCancel}
          styles={{ height: '32px' }}
          disabled={isSaving}
          data-cy={'button-cancel'}
        >
          <Button.Content title="Cancel" />
        </Button>
        <Button
          darkMode={darkMode}
          onClick={handleSave}
          styles={{ backgroundColor: '#3E63DD', color: '#FDFDFE', height: '32px' }}
          disabled={error !== null || pageHandle === page?.handle}
          isLoading={isSaving}
          data-cy={'button-save'}
        >
          <Button.Content title="Save" iconSrc="assets/images/icons/save.svg" direction="left" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
