import React, { useEffect, useState } from 'react';
import './style.css'; // Ensure this file exists with necessary styling
import AgoraRTC, { createClient, createMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { RtmClient, RtmChannel } from 'agora-rtm-sdk'; // Ensure correct imports

// Agora configuration
const appid = '5d4e204a0e88498aaa9a56b80608771e';
const token = '007eJxTYOC/XcCy/EMLx5t70i3/GAS1NBiNi+Tu3PBb7ZC01Ev46AIFBtMUk1QjA5NEg1QLCxNLi8TERMtEU7MkCwMzAwtzc8NUG1uF9IZARoYlr42YGRkgEMRnYygpzyxJzmBgAADMah1y'; // Replace with your generated token
const staticRoomId = 'twitch'; // Static room ID

// Random UIDs for RTC and RTM users
let rtcUid = Math.floor(Math.random() * 2032);
const rtmUid = String(Math.floor(Math.random() * 2032));

const MeetingRoom = () => {
    const [roomId, setRoomId] = useState(staticRoomId);
    const [micMuted, setMicMuted] = useState(true);
    const [rtcClient, setRtcClient] = useState(null);
    const [rtmClient, setRtmClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [remoteAudioTracks, setRemoteAudioTracks] = useState({});

    useEffect(() => {
        // Attach event listener to handle the page refresh/unload
        window.addEventListener('beforeunload', leaveRtmChannel);
        return () => window.removeEventListener('beforeunload', leaveRtmChannel);
    }, []);

    // Initialize RTM (text chat) with Agora RTM SDK
    const initRtm = async (name) => {
        const client = RtmClient.createInstance(appid); // Ensure correct instance creation
        setRtmClient(client);

        await client.login({ uid: rtmUid, token });
        const roomChannel = client.createChannel(roomId);
        await roomChannel.join();
        setChannel(roomChannel);

        await client.addOrUpdateLocalUserAttributes({
            name,
            userRtcUid: rtcUid.toString(),
        });

        roomChannel.on('MemberJoined', handleMemberJoined);
        roomChannel.on('MemberLeft', handleMemberLeft);
        getChannelMembers(roomChannel);
    };

    // Initialize RTC (real-time audio) with Agora RTC SDK
    const initRtc = async () => {
        try {
            const client = createClient({ mode: 'rtc', codec: 'vp8' });
            setRtcClient(client);

            client.on('user-published', handleUserPublished);
            client.on('user-left', handleUserLeft);

            // Try joining with the given UID
            await client.join(appid, roomId, token, rtcUid);
            
            const audioTrack = await createMicrophoneAudioTrack();
            audioTrack.setMuted(micMuted);
            setLocalAudioTrack(audioTrack);

            await client.publish(audioTrack);
            initVolumeIndicator(client);
        } catch (error) {
            console.error("Error joining RTC:", error);
            // Handle other error cases as necessary
        }
    };

    // Monitor volume levels of participants
    const initVolumeIndicator = (client) => {
        AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
        client.enableAudioVolumeIndicator();

        client.on('volume-indicator', (volumes) => {
            volumes.forEach((volume) => {
                const item = document.querySelector(`.user-rtc-${volume.uid}`);
                if (item) {
                    item.style.borderColor = volume.level >= 50 ? '#00ff00' : '#fff';
                }
            });
        });
    };

    // Handle user joining the audio stream
    const handleUserPublished = async (user, mediaType) => {
        await rtcClient.subscribe(user, mediaType);
        if (mediaType === 'audio') {
            remoteAudioTracks[user.uid] = user.audioTrack;
            setRemoteAudioTracks({ ...remoteAudioTracks });
            user.audioTrack.play();
        }
    };

    // Handle user leaving the audio stream
    const handleUserLeft = (user) => {
        delete remoteAudioTracks[user.uid];
        setRemoteAudioTracks({ ...remoteAudioTracks });
    };

    // Handle RTM member join events
    const handleMemberJoined = async (MemberId) => {
        const { name, userRtcUid } = await rtmClient.getUserAttributesByKeys(MemberId, ['name', 'userRtcUid']);
        const newMember = `
            <div class="speaker user-rtc-${userRtcUid}" id="${MemberId}">
                <p>${name}</p>
            </div>`;
        document.getElementById('members').insertAdjacentHTML('beforeend', newMember);
    };

    // Handle RTM member leave events
    const handleMemberLeft = (MemberId) => {
        document.getElementById(MemberId)?.remove();
    };

    // Get all channel members and display them
    const getChannelMembers = async (roomChannel) => {
        const members = await roomChannel.getMembers();
        for (const member of members) {
            const { name, userRtcUid } = await rtmClient.getUserAttributesByKeys(member, ['name', 'userRtcUid']);
            const newMember = `
                <div class="speaker user-rtc-${userRtcUid}" id="${member}">
                    <p>${name}</p>
                </div>`;
            document.getElementById('members').insertAdjacentHTML('beforeend', newMember);
        }
    };

    // Toggle microphone on/off
    const toggleMic = () => {
        setMicMuted(!micMuted);
        localAudioTrack.setMuted(!micMuted);
    };

    // Handle room entry form submission
    const enterRoom = async (e) => {
        e.preventDefault();
        const displayName = e.target.displayname.value;

        await initRtc();
        await initRtm(displayName);

        document.getElementById('form').style.display = 'none';
        document.getElementById('room-header').style.display = 'flex';
    };

    // Leave RTM channel and logout
    const leaveRtmChannel = async () => {
        if (channel) await channel.leave();
        if (rtmClient) await rtmClient.logout();
    };

    // Leave the room and cleanup resources
    const leaveRoom = async () => {
        const confirmLeave = window.confirm("Are you sure you want to leave the room?");
        if (!confirmLeave) return;

        try {
            // Stop and close the local audio track
            localAudioTrack.stop();
            localAudioTrack.close();

            // Unpublish and leave the RTC channel
            await rtcClient.unpublish(localAudioTrack);
            await rtcClient.leave();

            // Leave the RTM channel
            await leaveRtmChannel();

            // Reset state
            setLocalAudioTrack(null);
            setRemoteAudioTracks({});
            setRtmClient(null);
            setChannel(null);
            document.getElementById('members').innerHTML = '';
            document.getElementById('form').style.display = 'flex';
            document.getElementById('room-header').style.display = 'none';
        } catch (error) {
            console.error("Error leaving the room:", error);
        }
    };

    return (
        <div className="App">
            <form id="form" onSubmit={enterRoom}>
                <h1>Enter the Room</h1>
                <input type="text" name="displayname" placeholder="Your Name" required />
                <button type="submit">Join</button>
            </form>
            <div id="room-header" style={{ display: 'none' }}>
                <h1>Room: {roomId}</h1>
                <button onClick={leaveRoom}>Leave Room</button>
                <button onClick={toggleMic}>{micMuted ? 'Unmute' : 'Mute'}</button>
            </div>
            <div id="members" />
        </div>
    );
};

export default MeetingRoom;
