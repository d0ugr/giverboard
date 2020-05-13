import React, { Fragment } from "react";

import * as csv from "papaparse";



function ImportReader(props) {

  const onClick = (_event) => {
    document.querySelector(`#${props.id}`).click();
  };

  const openFiles = (event) => {
    const files = event.target.files;
    const fileReader = new FileReader();
    if (files.length > 0) {
      const fileInfo = {
        name: files[0].name,
        size: files[0].size,
        type: files[0].type
      };

      fileReader.onload = (_event) => {
        const csvData = csv.parse(
          fileReader.result,
          {
            error:    props.onError,
            encoding: props.fileEncoding
          }
        );
        props.onFileLoaded && props.onFileLoaded(fileInfo, csvData.data)
      }

      fileReader.readAsText(files[0], props.fileEncoding)
    }
  };

  return (
    <Fragment>
      <label
        className={props.className}
        onClick={onClick}
      >
        {props.prompt}
      </label>
      <input
        id={props.id}
        type="file"
        style={{display: "none"}}
        accept=".csv, text/csv"
        onChange={openFiles}
      />
    </Fragment>
  );

}

export default ImportReader;
