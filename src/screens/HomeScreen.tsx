// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import { signOut, User } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { getWalletInfo, mintTokens, burnTokens } from '../api/walletApi';

// Only fetch and display wallet info when the user presses the button

type Props = { user: User };

export default function HomeScreen({ user }: Props) {
  const [profile, setProfile] = useState<{ firstName?: string; lastName?: string; dateOfBirth?: string; email?: string } | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [burning, setBurning] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) setProfile(snap.data());
      } catch (e) {
        // Optionally handle error
      }
    };
    fetchProfile();
  }, [user.uid]);

  const fetchWalletInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user document for wallet address
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists() || !snap.data().walletAddress) {
        setError('Wallet address not found.');
        setLoading(false);
        return;
      }
      setWalletAddress(snap.data().walletAddress);

      // Fetch balance from backend
      const info = await getWalletInfo(user.uid);
      setBalance(info.balance);
    } catch (err) {
      setError('Failed to fetch wallet info.');
    } finally {
      setLoading(false);
    }
  };

  const handleMint = async () => {
    if (!walletAddress) return;
    setMinting(true);
    setError(null);
    try {
      await mintTokens(user.uid, 100); // Mint 100 tokens
      await fetchWalletInfo();
    } catch (err) {
      setError('Failed to mint tokens.');
    } finally {
      setMinting(false);
    }
  };

  const handleBurn = async () => {
    if (!walletAddress) return;
    setBurning(true);
    setError(null);
    try {
      await burnTokens(user.uid, 100); // Burn 100 tokens
      await fetchWalletInfo();
    } catch (err) {
      setError('Failed to burn tokens.');
    } finally {
      setBurning(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4 pt-8">
      <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md self-center shadow-card mb-6">
        <Text className="text-2xl font-bold text-center mb-2">
          Welcome{profile?.firstName ? `, ${profile.firstName}` : ''}!
        </Text>
        {profile && (
          <>
            <Text className="text-base text-gray-600 text-center mb-1">
              Name: {profile.firstName} {profile.lastName}
            </Text>
            <Text className="text-base text-gray-600 text-center mb-1">
              Date of Birth: {profile.dateOfBirth}
            </Text>
            <Text className="text-base text-gray-600 text-center mb-1">
              Email: {profile.email}
            </Text>
          </>
        )}
        <TouchableOpacity
          onPress={fetchWalletInfo}
          className="bg-brand-500 rounded-full py-2 mb-3"
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? 'Loading...' : 'Get Wallet Info'}
          </Text>
        </TouchableOpacity>
        {error && <Text className="text-red-500 text-center">{error}</Text>}
        {walletAddress && (
          <>
            <Text className="text-xs text-center break-all">
              Address: {walletAddress}
            </Text>
            <TouchableOpacity
              onPress={handleMint}
              className="bg-green-500 rounded-full py-2 my-2"
              disabled={minting}
            >
              <Text className="text-white text-center font-semibold">
                {minting ? 'Minting...' : 'Mint 100 Tokens'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBurn}
              className="bg-yellow-500 rounded-full py-2 mb-2"
              disabled={burning}
            >
              <Text className="text-white text-center font-semibold">
                {burning ? 'Burning...' : 'Burn 100 Tokens'}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {balance !== null && (
          <Text className="text-base text-center">Balance: {balance}</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => signOut(auth)}
        className="bg-red-500 rounded-full py-3 w-11/12 max-w-md self-center"
      >
        <Text className="text-white text-center font-semibold">Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
