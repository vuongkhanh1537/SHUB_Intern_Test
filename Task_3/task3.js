const baseUrl = 'https://share.shub.edu.vn/api/intern-test'

async function fetchData() {
    try {
        const response = await fetch(`${baseUrl}/input`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch data')
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching data', err);
        return null;
    }
}

function preHandleData(data) {
    let t1HandledData = [data[0]];
    let t2HandledData = [data[0]];

    let t1Acc = data[0];
    let t2Acc = data[0];
    for (let i = 1; i < data.length; ++i) {
        t1Acc += data[i];
        t2Acc += (i % 2 === 0? 1 : -1)* data[i];
        t1HandledData.push(t1Acc);
        t2HandledData.push(t2Acc);  
    }

    return {
        t1HandledData,
        t2HandledData
    };
}

async function processData(input) {
    const { query, data } = input;
    const { t1HandledData, t2HandledData } = preHandleData(data);
    const result = query.map(query => {
        const { type, range } = query;
        if (range[0] === 0) {
            return type === '1'? t1HandledData[range[1]] : t2HandledData[range[1]];
        }
        if (type === '1') {
            return t1HandledData[range[1]] - t1HandledData[range[0] - 1];
        } else {
            return t2HandledData[range[1]] - t2HandledData[range[0] - 1];
        }
    })
 
    return result;
}

async function sendResult(token, result) {
    try {
        const response = await fetch(`${baseUrl}/output`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }, 
            body: JSON.stringify(result)
        })
        if (response.status !== 200) {
            throw new Error('Failed to send result');
        }
    } catch(err) {
        console.error('Error sending data:', err);
    }
}

async function main() {
    const data = await fetchData();
    if (!data) {
        console.log('No data fetched');
        return;
    }
    const { token, ...rest } = data;
    const processedData = await processData(data);

    await sendResult(token, processedData);
}

main();

