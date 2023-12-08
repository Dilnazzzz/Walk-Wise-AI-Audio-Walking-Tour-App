import * as FileSystem from "expo-file-system";

export const writeAudioToFile = async (audioData: string) => {
    const path = FileSystem.documentDirectory + "temp.mp3";
    await FileSystem.writeAsStringAsync(path, audioData, {
        encoding: FileSystem.EncodingType.Base64,
    });
    return path;
};

