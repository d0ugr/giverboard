


export const arrayMove = (array, oldIndex, newIndex) => {
  if (newIndex >= array.length) {
    let k = newIndex - array.length + 1;
    while (k--) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  // return array; // for testing
};



export const uuidv4 = function() {
  // 079cc81a-cf12-4046-9770-1ed443f6a08d
  return generate_uuidv4([1e7] + -1e3 + -4e3 + -8e3 + -1e11);
};

export const uuidv4_compact = function() {
  // 079cc81acf12404697701ed443f6a08d
  return generate_uuidv4([1e7] + 1e3 + 4e3 + 8e3 + 1e11);
};

const generate_uuidv4 = function(format_string) {
  return format_string.replace(/[018]/g, function(c) {
     return (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16);
  });
/*
  let d = new Date().getTime();
  if ((typeof performance !== "undefined") && (typeof performance.now === "function")) {
     d += performance.now();
  }
  return format_string.replace(/[xy]/g, function(c) {
     let r = (d + Math.random() * 16) % 16 | 0;
     d = Math.floor(d / 16);
     return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
*/
};



export const mergeObjects = (object1, object2) => {
  return {
    ...object1,
    ...object2
  };
};
