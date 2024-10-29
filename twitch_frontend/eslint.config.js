import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
// src/agoraConfig.js
import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-sdk-ng';

const appId = '<YOUR_AGORA_APP_ID>'; // Replace with your Agora App ID
let client = createClient({ mode: 'rtc', codec: 'vp8' });
let localTracks = { videoTrack: null, audioTrack: null };

export const joinChannel = async (channelName, token, uid) => {
  await client.join(appId, channelName, token, uid);
  localTracks = await createMicrophoneAndCameraTracks();
  await client.publish(Object.values(localTracks));
  console.log('Published local stream');
  return localTracks;
};

export const leaveChannel = async () => {
  localTracks.audioTrack?.close();
  localTracks.videoTrack?.close();
  await client.leave();
  console.log('Left the channel');
};

export const subscribeToRemoteUsers = (onRemoteUserPublished) => {
  client.on('user-published', onRemoteUserPublished);
};
