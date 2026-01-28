import { Audio } from 'expo-av';

export const playFromPath = async (path: string) => {
  try {
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri: path });
    await soundObject.playAsync();
  } catch (error) {
    console.error(error);
  }
};
