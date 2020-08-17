export async function getDataFromServer(url) {
  const response = await fetch(url, {
    method: 'GET',
  });
  const newResult = await response.json();
  return newResult;
}

export async function setDataOnServer(url, method, data) {
  let response;
  if (method === 'DELETE') {
    response = await fetch(url, {
      method: method,
    });
  } else {
    response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
    });
  }
  const result = await response.json();

  return result;
}
