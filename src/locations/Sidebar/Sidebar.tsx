import { useState, useEffect } from 'react';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { Paragraph, Button, Card, Stack, Flex, ButtonGroup, ToggleButton } from '@contentful/f36-components';
import { CopyIcon, DoneIcon, CloudUploadIcon } from '@contentful/f36-icons';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { styles } from './Sidebar.styles';

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const {
    copyFormat
  } = sdk.parameters.installation
  const [thumbnails, setThumbnails] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState({copied: ""});
  const [copyStyle, setCopyStyle] = useState("markdown");

  const openDialog = async () => {
    sdk.dialogs
    .openCurrentApp({
      width: 800,
      minHeight: 640,
      position: 'center',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true
      })
    .then((data) => {
      setThumbnails(data) 
    });
  }

  const copyAssetToClipboard = async (url: string, filename: string) => {
    let formatText = url
    if(copyStyle === "markdown"){
      formatText = `![${filename}](${url})`
    }else if(copyStyle === "html"){
      formatText = `<img src="${url}" alt="${filename}" />`
    }
    await navigator.clipboard.writeText(formatText || "")
    setCopiedUrl({copied: url})
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [])

  return (
    <>
      <Button
        variant="primary"
        onClick={openDialog}
        startIcon={<CloudUploadIcon size="medium" />}
        isFullWidth>Upload to Cloudinary</Button>

      <Stack flexDirection="column" className={styles.stack}>
        {thumbnails?.length > 0
        ? (
          <>
          {( copyFormat != null && Object.values(copyFormat).filter((v) => {return v}).length > 1) && 
            <ButtonGroup className={styles.buttons}>
            {Object.keys(copyFormat).map((key, index) => (
              copyFormat[key] && 
              <ToggleButton
              isActive={copyStyle === key && true}
              aria-label={key}
              size="small"
              onToggle={() => {setCopyStyle(key)}}
              key={index}
              >
            {key.toUpperCase()}
            </ToggleButton>
          ))}
            </ButtonGroup>
          }
          {thumbnails.map(({url, filename}) => (
          <Card
            onClick={() => copyAssetToClipboard(url, filename)}
            key={url}
            className={styles.thumbnail}
          >
            <Flex
              flexDirection="row"
              gap="spacingS"
              alignItems="center"
            >
              <img src={url} width="130" height="72" />
              <Flex className={styles.copyText}>
                {copiedUrl["copied"] === url
                  ? <DoneIcon size="tiny" variant="secondary" />
                  : <CopyIcon size="tiny" variant="secondary" />
                }
                <span>{copiedUrl["copied"] === url ? "Copied!" : "Copy to Clipboard"}</span>
              </Flex>
            </Flex>
          </Card>
          ))}
          </>)
        : <Paragraph className={styles.note}>Uploaded images will be displayed here</Paragraph>
        }
      </Stack>
    </>
    
  )
};

export default Sidebar;