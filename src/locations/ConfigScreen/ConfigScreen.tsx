import React, { useCallback, useState, useEffect } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import {
  Box, Form, FormControl, Flex, TextInput, Paragraph, Checkbox, Heading, Note, TextLink, Switch, Accordion
 } from '@contentful/f36-components';
import {
  ExternalLinkIcon
} from '@contentful/f36-icons';
import { css } from 'emotion';
import { useSDK } from '@contentful/react-apps-toolkit';
import { styles } from './ConfigScreen.styles';
import imgScreenshotAdvancedOptions from '../../assets/scr_advanced_options.png'
import imgScreenshotCloudName from '../../assets/scr_cloud_name.png'
import imgScreenshotCopyFormat from '../../assets/scr_copy_format.png'
import imgScreenshotUploadPreset from '../../assets/scr_upload_preset.png'



export interface AppInstallationParameters {
  cloudName?: string;
  uploadPreset?: string;
  sources?: string;
  copyFormat?: {
    [style: string]: boolean;
  };
  showAdvancedOptions?: boolean;
}

const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();
  const [parameters, setParameters] = useState<AppInstallationParameters>();
  const defaultSources = "local, url, camera, dropbox, image_search, facebook, instagram, shutterstock, gettyimages, istock, unsplash, google_drive"
  const defaultCopyStyle = {url: true, markdown: true, html: true}
  const [isValidSources, setIsValidSources] = useState<boolean>(false);
  const [isInvalidCopyFormat, setIsInvalidCopyFormat] = useState<boolean>(false);

  const handleConfigure = useCallback(async () => {

    setIsValidSources(true);
    if(!parameters?.sources){
      sdk.notifier.error("Provide at least one upload source.");
      setIsValidSources(false);
      return false;
    }

    setIsInvalidCopyFormat(true);
    if(parameters?.copyFormat && !Object.values(parameters?.copyFormat).includes(true)){
      sdk.notifier.error("Provide at least one upload copy format.");
      setIsInvalidCopyFormat(false);
      return false;
    }
    
    const currentState = await sdk.app.getCurrentState();
    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(() => handleConfigure());
      
  }, [sdk, handleConfigure]);

  const onChangeCopyFormat = (e: any) => {
    setParameters({
      ...parameters, 
      copyFormat: {
        ...parameters?.copyFormat,
        [e.target.value]: parameters?.copyFormat && !parameters.copyFormat[e.target.value]
      }
    })
  } 

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();
      if (currentParameters) {
        if(Object.keys(currentParameters).length > 0){
          setParameters(currentParameters);
        }else{
          setParameters({
            ...parameters, 
            sources: defaultSources,
            copyFormat: defaultCopyStyle
          })
        }
      }
      setIsValidSources(true)
      setIsInvalidCopyFormat(true)
      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Flex flexDirection="column" className={css({ margin: '80px auto', maxWidth: '660px' })}>

      <Box>
        <Heading as="h2">About Cloudinary Upload Widget</Heading>
        <Paragraph>
          This app connects Cloudinary Upload Widget with your Contentful space so you can upload assets to Cloudinary and use them for your contents.
        </Paragraph>
      </Box>

      <hr />

      <Form>
        <Heading as="h2">Configuration</Heading>
        <Note variant="neutral" className={styles.note}>
          Register <TextLink
            icon={<ExternalLinkIcon />}
            alignIcon="end"
            href="https://cloudinary.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudinary
          </TextLink> and go to the dashboard and get the props.
        </Note>
        <FormControl isRequired className={styles.formBlock}>
          <FormControl.Label>Cloud name (<code className={styles.code}>cloudName</code>)</FormControl.Label>
          <TextInput
            value={parameters?.cloudName || ""}
            type='text'
            onChange={(e) => setParameters({...parameters, cloudName: e.target.value})}
          />
          <Accordion className={styles.accordion}>
            <Accordion.Item title="How can I find it?">
              <img src={imgScreenshotCloudName} className={styles.screenshot} />
            </Accordion.Item>
          </Accordion>
        </FormControl>
        <FormControl isRequired className={styles.formBlock}>
          <FormControl.Label>Upload preset (<code className={styles.code}>uploadPreset</code>)</FormControl.Label>
          <TextInput
            value={parameters?.uploadPreset || ""}
            type='text'
            onChange={(e) => setParameters({...parameters, uploadPreset: e.target.value})}
          />
          <FormControl.HelpText>The name of an upload preset defined for your product environment. Make sure you specify an <b>unsigned upload</b> preset.</FormControl.HelpText>
          <Accordion className={styles.accordion}>
            <Accordion.Item title="How can I find it?">
              <img src={imgScreenshotUploadPreset} className={styles.screenshot} />
            </Accordion.Item>
          </Accordion>
        </FormControl>
        <FormControl isRequired className={styles.formBlock}>
          <FormControl.Label>Upload sources (<code className={styles.code}>sources</code>)</FormControl.Label>
          <TextInput
            value={parameters?.sources || ""}
            type='text'
            onChange={(e) => setParameters({...parameters, sources: e.target.value})}
            isInvalid={!isValidSources}
          />
          <FormControl.HelpText>
            Provide at least one attribute.
            <Note
              variant="neutral"
              title="Options"
              className={styles.note}
            >
              <code>{defaultSources}</code>
            </Note>
          </FormControl.HelpText>
        </FormControl>
        <FormControl className={styles.formBlock}>
          <FormControl.Label>Copy format</FormControl.Label>
          {Object.keys(defaultCopyStyle).map((key, index) => (
            <Checkbox
              isChecked={(parameters?.copyFormat && parameters?.copyFormat[key]) || false}
              onChange={(e) => onChangeCopyFormat(e)}
              isInvalid={!isInvalidCopyFormat}
              value={key}
              key={index}
            >
            {key}
            </Checkbox>
          ))}
          <FormControl.HelpText>You can copy the images from Cloudinary with prefered format.</FormControl.HelpText>
          <Accordion className={styles.accordion}>
            <Accordion.Item title="What is this?">
              <img src={imgScreenshotCopyFormat} className={styles.screenshot} />
            </Accordion.Item>
          </Accordion>
        </FormControl>
        <FormControl className={styles.formBlock}>
          <FormControl.Label>Advanced options (<code className={styles.code}>showAdvancedOptions</code>)</FormControl.Label>
          <Switch
            name="allow-cookies-controlled"
            id="allow-cookies-controlled"
            isChecked={parameters?.showAdvancedOptions || false}
            onChange={() => setParameters({...parameters, showAdvancedOptions: !parameters?.showAdvancedOptions})}
          >
            Show advanced options
          </Switch>
          <FormControl.HelpText>This enables users to set the Public ID, Add a Tag, and select an Upload Preset (only if getUploadPresets is defined).</FormControl.HelpText>
          <Accordion className={styles.accordion}>
            <Accordion.Item title="What is this?">
              <img src={imgScreenshotAdvancedOptions} className={styles.screenshot} />
            </Accordion.Item>
          </Accordion>
        </FormControl>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;