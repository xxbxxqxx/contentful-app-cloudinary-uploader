import { useState, useEffect } from 'react';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { Paragraph, Button, Card, Stack, Flex, ButtonGroup, ToggleButton, Checkbox, IconButton } from '@contentful/f36-components';
import { CopyIcon, DoneIcon, CloudUploadIcon } from '@contentful/f36-icons';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { styles } from './Sidebar.styles';

type thumbnailType = {
  url: string;
  filename: string;
};

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const {
    copyFormat
  } = sdk.parameters.installation
  const [thumbnails, setThumbnails] = useState<thumbnailType[]>([]);
  const [copiedUrl, setCopiedUrl] = useState({copied: ""});
  const [copyStyle, setCopyStyle] = useState("markdown");
  const [copiedAllUrl, setCopiedAllUrl] = useState(false);
  const userId = sdk.user.sys.id
  const entrySys = sdk.entry.getSys()
  const entryId = entrySys.id

  const openDialog = async () => {
    sdk.dialogs
    .openCurrentApp({
      width: 800,
      minHeight: 640,
      position: 'center',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      parameters: { userId: userId || "nodata", entryId: entryId || "nodata" }
      })
    .then((data) => {
      data.map((image: any) => {
        setThumbnails((prevThumbnails) => {
          return [...prevThumbnails, image];
        });
      })
      setCopiedAllUrl(false)
    });
  }

  const returnFormattedAsset = (url: string, filename: string) => {
    let formatText = url
    if(copyStyle === "markdown"){
      formatText = `![${filename}](${url})`
    }else if(copyStyle === "html"){
      formatText = `<img src="${url}" alt="${filename}" />`
    }
    return formatText
  };

  const copyAssetToClipboard = async (url: string, filename: string) => {    
    const target = returnFormattedAsset(url, filename)
    await navigator.clipboard.writeText(target || "")
    setCopiedUrl({copied: url})
  };

  const copyAllToClipboard = async () => {
    const allTargets = thumbnails.map(({url, filename}) => {
      return returnFormattedAsset(url, filename)
    })
    await navigator.clipboard.writeText(allTargets.join("\r")|| "")
    setCopiedAllUrl(true)
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
        
          <Button
            size="small"
            startIcon={copiedAllUrl ? <DoneIcon /> : <CopyIcon />}
            onClick={() => copyAllToClipboard()}    
          >Copy ALL</Button>

          {thumbnails.map(({url, filename}) => (
          <Card
            key={url}
            className={styles.thumbnail}
          >
            <Flex
              flexDirection="row"
              gap="spacingXs"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex
                alignItems="center"
                gap="spacingXs"
              >
                <img src={url} />

                <div className={styles.copyTexts}>
                  <p className={styles.fileName}>{filename}</p>
                </div>
              </Flex>
                
              <div className={styles.copyIcon}>
                {copiedUrl["copied"] === url
                  ? <IconButton
                    variant="transparent"
                    aria-label="Copy URL"
                    size="small"
                    icon={<DoneIcon />}
                    onClick={() => copyAssetToClipboard(url, filename)}
                    />
                  : <IconButton
                    variant="secondary"
                    aria-label="Copy URL"
                    size="small"
                    icon={<CopyIcon />}
                    onClick={() => copyAssetToClipboard(url, filename)}
                    />
                }
              </div>

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