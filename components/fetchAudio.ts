const fetchAudio = async (text: string) => {  
    const response = await fetch(process.env.EXPO_PUBLIC_MY_ENDPOINT!, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text }),

    });
    return await response.blob();
}; 
