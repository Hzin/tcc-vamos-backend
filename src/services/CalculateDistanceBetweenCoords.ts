interface Request {
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
}

function convertToRad(lat: number, lng: number) {
  let latRad = lat * (Math.PI / 180);
  let lngRad = lng * (Math.PI / 180);

  return { latRad, lngRad };
}

function CalculateDistanceBetweenCoords({ lat1, lng1, lat2, lng2 }: Request){
  let { latRad, lngRad } = convertToRad(lat1, lng1);
  let { latRad: lat2Rad, lngRad: lng2Rad } = convertToRad(lat2, lng2);

  let d = Math.acos(Math.sin(latRad) * Math.sin(lat2Rad) + Math.cos(latRad) * Math.cos(lat2Rad) * Math.cos(lngRad - lng2Rad)) * 6371;

  return d;
}


export default CalculateDistanceBetweenCoords;
