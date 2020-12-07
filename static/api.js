const retrieveSummaryFromApi = async() => {
    const response = await fetch('/api/summary');
    console.log(response);
    const json = await response.json();    
    console.log(json);
}

const retrieveDaySummaryFromApi = async() => {
    const response = await fetch('/api/summary/:year/:month/:day');
    console.log(response);
    const json = await response.json();    
    console.log(json);
}