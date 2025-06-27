function isJsonObject(x: any){
  if(typeof x === 'object' && !Array.isArray(x) && x !== null)
    return true
  else return false
}
export function removeNulls(obj: any): {} {
  if ( !isJsonObject(obj) )
      return obj;

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null || v != undefined)
      .map(([k, v]) => [k, isJsonObject(v) ? removeNulls(v) : v])
  );
}

export function formatGetReqJson(obj: any): {} {
  let newObj = removeNulls(obj);
  if (!newObj || Object.keys(newObj)?.length === 0)
    return '';

  const params = []
  for (const [key, value] of Object.entries(newObj)) {
    params.push(`${key}=${value}`);
  }
  
  return params.join('&')
}


export function sortArray( arr : any[] , key: string ){
  if(!arr || arr?.length === 0)
      return arr ?? []
  
  return arr?.sort((a , b) => a[key] - b[key] ) 
}


export function isValidJSON(str : string) {
  // Check if the string starts with '{' or '[' and ends with '}' or ']'
  if (typeof str === 'string' && (str.startsWith('{') && str.endsWith('}')) || 
  (str.startsWith('[') && str.endsWith(']'))) {
      try {
          // Attempt to parse the string to verify JSON structure
          const parsed = JSON.parse(str);

          // Additional checks to ensure the parsed result is an object or array
          if (typeof parsed === 'object' && parsed !== null) {
              return true;
          }
      } catch (e) {
          return false;
      }
  }
  return false;
}