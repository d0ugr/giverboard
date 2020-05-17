import React, { Fragment } from "react";

import * as csv from "papaparse";



function ImportReader(props) {

  const elementId    = props.id || `import-reader-${Math.floor(Math.random() * 999999)}`;
  const accept       = props.accept || ".csv, text/csv";
  const fileEncoding = props.fileEncoding || "UTF-8";

  const onClick = (_event) => {
    document.querySelector(`#${elementId}`).click();
  };

  const openFiles = (event) => {
    const files      = event.target.files;
    const fileReader = new FileReader();

    if (files.length > 0) {
      const fileInfo = {
        name: files[0].name,
        size: files[0].size,
        type: files[0].type
      };

      fileReader.onload = (_event) => {
        const csvData = csv.parse(
          fileReader.result, {
            error:          props.onError,
            encoding:       fileEncoding,
            header:         props.skipHeader,
            skipEmptyLines: true
          }
        );
        props.onFileLoaded && props.onFileLoaded(fileInfo, csvData.data)
      }

      fileReader.readAsText(files[0], fileEncoding)
    }
  };

  return (
    <Fragment>
      {props.prompt &&
        <div onClick={onClick}>
          {props.prompt}
        </div>}
      <input
        id={elementId}
        type="file"
        style={{display: "none"}}
        accept={accept}
        onChange={openFiles}
      />
    </Fragment>
  );

}

export default ImportReader;
