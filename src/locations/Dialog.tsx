import { DialogAppSDK, init } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

export interface ThumbnailParameters {
  url: string | string[];
  filename: string | string[];
}

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  let thumbnails: ThumbnailParameters[] = []

  const {
    cloudName,
    uploadPreset,
    sources,
    showAdvancedOptions,
    makeFolderOption
  } = sdk.parameters.installation

  const params: any = sdk.parameters.invocation
  const {
    userId,
    entryId
  } = params

  //prepare folder name
  let folder = ""
  if(makeFolderOption){
    let d = new Date();
    let year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0");
    let day = d.getDate().toString().padStart(2, "0");
    folder = `${year}/${month}/${day}`
  }

  const instance = window.cloudinary.createUploadWidget(
    {
      cloudName: cloudName,
      uploadPreset: uploadPreset,
      showAdvancedOptions: showAdvancedOptions || false,
      sources: sources.replaceAll(/\s+/g, '').split(','),
      folder: folder,
      useAssetFolderAsPublicIdPrefix: false,
      context: {
        userId: userId || "nodata",
        entryId: entryId || "nodata"
      }
    },
    (err: any, info: any) => {
      if (!err) {
        if (info["event"] === "success"){
          thumbnails.push({
            url: [info["info"]["secure_url"]],
            filename:  [info["info"]["original_filename"]]
          })
        }
        if (info["event"] === "close"){
          sdk.close(thumbnails)
        }
      }
    }
  )

  init((sdk) => {
    instance.open()
  });

  return null;
};

export default Dialog;
