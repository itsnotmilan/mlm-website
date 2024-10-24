import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Coins, TrendingUp, ArrowDownToLine, ArrowUpFromLine, AlertCircle, HelpCircle, Timer, RefreshCw } from 'lucide-react';
import { useWalletBalance } from '../hooks/useWalletBalance';

function StakingComponent() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useWalletBalance();
  const [stakeAmount, setStakeAmount] = useState('0.7');
  const [stakedAmount, setStakedAmount] = useState('0');
  const [rewardAmount, setRewardAmount] = useState('0.07');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [compoundStreak, setCompoundStreak] = useState(0);
  const [tvl, setTvl] = useState(0);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [timeUntilNextAction, setTimeUntilNextAction] = useState({ hours: 24, minutes: 0, seconds: 0 });
  const [canPerformAction, setCanPerformAction] = useState(false);

  // Update cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const timeSinceLastAction = now - lastActionTime;
      const timeLeft = Math.max(86400 - timeSinceLastAction, 0);
      
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      
      setTimeUntilNextAction({ hours, minutes, seconds });
      setCanPerformAction(timeLeft === 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActionTime]);

  const formatTimeLeft = () => {
    const { hours, minutes, seconds } = timeUntilNextAction;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStake = async () => {
    setError('');
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setError('Please enter a valid stake amount.');
      return;
    }
    if (parseFloat(stakeAmount) > balance) {
      setError('Insufficient balance for staking.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate staking process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStakedAmount((parseFloat(stakedAmount) + parseFloat(stakeAmount)).toFixed(4));
      setTvl(prev => prev + parseFloat(stakeAmount));
      setStakeAmount('');
      setLastActionTime(Math.floor(Date.now() / 1000));
      await refetchBalance();
    } catch (err) {
      console.error('Error staking:', err);
      setError('Failed to stake. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompound = async () => {
    setError('');
    if (!canPerformAction) {
      setError('Please wait for the cooldown to finish.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate compounding process
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newStakedAmount = parseFloat(stakedAmount) + parseFloat(rewardAmount);
      setStakedAmount(newStakedAmount.toFixed(4));
      setTvl(prev => prev + parseFloat(rewardAmount));
      setRewardAmount('0');
      setCompoundStreak(prev => prev + 1);
      setLastActionTime(Math.floor(Date.now() / 1000));
      await refetchBalance();
    } catch (err) {
      console.error('Error compounding:', err);
      setError('Failed to compound. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    setError('');
    if (!canPerformAction) {
      setError('Please wait for the cooldown to finish.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate claiming process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRewardAmount('0');
      setCompoundStreak(0);
      setLastActionTime(Math.floor(Date.now() / 1000));
      await refetchBalance();
    } catch (err) {
      console.error('Error claiming:', err);
      setError('Failed to claim. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate reward accrual
  useEffect(() => {
    const interval = setInterval(() => {
      setRewardAmount(prev => (parseFloat(prev) + 0.001).toFixed(4));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-grow flex items-center justify-center py-24 px-4">
      <div className="max-w-sm w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden relative">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">SOL Staking</h2>
          <div className="absolute top-2 right-2">
            <button className="text-gray-400 hover:text-white" title="Help">
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            <WalletMultiButton className="w-full" />
            {publicKey ? (
              <>
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold mb-2">Protocol Stats</h3>
                  <div className="flex justify-between items-center">
                    <span>Total Value Locked:</span>
                    <span className="font-bold">{tvl.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Next Action In:</span>
                    <div className="flex items-center">
                      <Timer className="w-4 h-4 mr-2" />
                      <span className="font-mono">{formatTimeLeft()}</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-lg mb-1">Your Balance</h3>
                  <div className="bg-gray-700 p-3 rounded-lg text-xl font-bold flex justify-between items-center">
                    <span>{balance.toFixed(4)} SOL</span>
                    <button 
                      onClick={refetchBalance} 
                      disabled={isBalanceLoading}
                      className="p-1 hover:text-yellow-400 transition-colors"
                      title="Refresh balance"
                    >
                      <RefreshCw className={`w-4 h-4 ${isBalanceLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg mb-1">Stake Amount (SOL)</h3>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full bg-gray-700 p-3 rounded-lg text-xl font-bold appearance-none"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                </div>
                <button
                  onClick={handleStake}
                  className="w-full py-3 text-lg font-bold bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-transform duration-300 relative overflow-hidden group transform hover:scale-105 rounded-lg"
                  disabled={isLoading || isBalanceLoading}
                >
                  <span className="relative z-10">{isLoading ? 'Processing...' : 'Stake SOL'}</span>
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                  <span className="absolute inset-0 border-4 border-yellow-500 rounded-lg opacity-0 group-hover:opacity-100 animate-border-glow"></span>
                </button>
                <div>
                  <h3 className="text-lg mb-1">Staked Amount</h3>
                  <div className="bg-gray-700 p-3 rounded-lg text-xl font-bold">
                    {stakedAmount} SOL
                  </div>
                </div>
                <div>
                  <h3 className="text-lg mb-1">Current Rewards</h3>
                  <div className="bg-gray-700 p-3 rounded-lg text-xl font-bold flex items-center justify-between">
                    <span>{rewardAmount} SOL</span>
                    <TrendingUp className="text-green-400 w-5 h-5" />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleCompound}
                    className={`flex-1 py-2 text-base font-semibold transition-colors duration-300 rounded-lg ${
                      canPerformAction 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-600 cursor-not-allowed opacity-50'
                    }`}
                    disabled={!canPerformAction || isLoading || isBalanceLoading}
                  >
                    Compound
                  </button>
                  <button
                    onClick={handleClaim}
                    className={`flex-1 py-2 text-base font-semibold transition-colors duration-300 rounded-lg ${
                      canPerformAction 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-600 cursor-not-allowed opacity-50'
                    }`}
                    disabled={!canPerformAction || isLoading || isBalanceLoading}
                  >
                    Claim
                  </button>
                </div>
                <div className="text-center text-sm text-gray-400">
                  <p>Connected to: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}</p>
                  <p>Network: Devnet</p>
                  <p>Compound Streak: {compoundStreak}</p>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400">Connect your wallet to start staking</p>
            )}
          </div>
        </div>
        {error && (
          <div className="bg-red-500 text-white p-3 text-center">
            <AlertCircle className="inline-block mr-2" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default StakingComponent;