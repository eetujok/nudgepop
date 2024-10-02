import {
  DropZone,
  LegacyStack,
  Thumbnail,
  Banner,
  List,
  Text,
} from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons'
import { useState, useCallback } from 'react';

export default function DropZoneWithImageFileUpload({ onFileUpload }) {

  const [file, setFile] = useState();
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setFile(acceptedFiles[0]);
      setRejectedFiles(_rejectedFiles);
      if (onFileUpload) {
        onFileUpload(acceptedFiles[0]);
      };
    },
    [onFileUpload],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !file && <DropZone.FileUpload />;

  const uploadedFile = file && (
    <LegacyStack>
      <Thumbnail
        size="small"
        alt={file.name}
        source={
          validImageTypes.includes(file.type)
            ? window.URL.createObjectURL(file)
            : NoteIcon
        }
      />
      <div>
        {file.name}{' '}
        <Text variant="bodySm" as="p">
          {file.size} bytes
        </Text>
      </div>
    </LegacyStack>
  );

  const errorMessage = hasError && (
    <Banner title="The following images couldn’t be uploaded:" tone="critical">
      <List type="bullet">
        {rejectedFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" is not supported. File type must be .gif, .jpg or .png.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );

  return (
    <LegacyStack vertical>
      {errorMessage}
      <DropZone allowMultiple={false} accept="image/*" type="image" onDrop={handleDrop}>
        {uploadedFile}
        {fileUpload}
      </DropZone>
    </LegacyStack>
  );
}