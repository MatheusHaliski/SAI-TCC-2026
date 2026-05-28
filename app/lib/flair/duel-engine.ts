import type { FlairCard, FlairDeck, DuelRound, DuelStat, FlairDuel } from './types';

// ─── The 5 duel rounds always test stats in this order ───────────────────────

export const DUEL_STAT_SEQUENCE: DuelStat[] = ['edge', 'range', 'clout', 'glow', 'art'];

export interface DuelSimulation {
  rounds: DuelRound[];
  finalScore: { challenger: number; opponent: number };
  winner: 'challenger' | 'opponent' | 'draw';
  highlight: string;
}

function deckStatAverage(deck: FlairDeck, stat: DuelStat): number {
  if (deck.cards.length === 0) return 0;
  return deck.cards.reduce((sum, c) => sum + c.stats[stat], 0) / deck.cards.length;
}

function applyBrandSynergyToStat(deck: FlairDeck, baseStat: number): number {
  if (!deck.brandSynergy) return baseStat;
  // Brand synergy multiplier applies a 25% portion to each stat
  const boost = (deck.brandSynergy.multiplier - 1) * 0.25 * baseStat;
  return baseStat + boost;
}

export function simulateDuel(
  challengerDeck: FlairDeck,
  opponentDeck: FlairDeck
): DuelSimulation {
  const rounds: DuelRound[] = DUEL_STAT_SEQUENCE.map((stat, idx) => {
    let cScore = deckStatAverage(challengerDeck, stat);
    let oScore = deckStatAverage(opponentDeck, stat);

    cScore = applyBrandSynergyToStat(challengerDeck, cScore);
    oScore = applyBrandSynergyToStat(opponentDeck, oScore);

    // Season sync bonus: +8 if majority of deck is synced
    const cSynced = challengerDeck.cards.filter((c) => c.stats.sync > 0).length;
    const oSynced = opponentDeck.cards.filter((c) => c.stats.sync > 0).length;
    if (cSynced > challengerDeck.cards.length / 2) cScore += 8;
    if (oSynced > opponentDeck.cards.length / 2) oScore += 8;

    // Combo bonuses add to relevant stats
    challengerDeck.comboBonuses.forEach((combo) => {
      if (combo.type === 'style_synergy' && stat === 'edge') cScore += combo.bonusPoints * 0.3;
      if (combo.type === 'season_sweep' && stat === 'art') cScore += combo.bonusPoints * 0.2;
    });
    opponentDeck.comboBonuses.forEach((combo) => {
      if (combo.type === 'style_synergy' && stat === 'edge') oScore += combo.bonusPoints * 0.3;
      if (combo.type === 'season_sweep' && stat === 'art') oScore += combo.bonusPoints * 0.2;
    });

    cScore = Math.round(cScore);
    oScore = Math.round(oScore);

    const roundWinner =
      cScore > oScore ? 'challenger' : oScore > cScore ? 'opponent' : 'draw';

    return { round: idx + 1, stat, challengerScore: cScore, opponentScore: oScore, winner: roundWinner };
  });

  const cWins = rounds.filter((r) => r.winner === 'challenger').length;
  const oWins = rounds.filter((r) => r.winner === 'opponent').length;
  const finalScore = { challenger: cWins, opponent: oWins };

  const winner =
    cWins > oWins ? 'challenger' : oWins > cWins ? 'opponent' : 'draw';

  const dominantRound = rounds.reduce((best, r) => {
    const diff = Math.abs(r.challengerScore - r.opponentScore);
    const bestDiff = Math.abs(best.challengerScore - best.opponentScore);
    return diff > bestDiff ? r : best;
  }, rounds[0]);

  const highlight =
    winner === 'draw'
      ? 'Both decks equally matched — a perfect draw!'
      : `Won on ${dominantRound.stat.toUpperCase()} by ${Math.abs(dominantRound.challengerScore - dominantRound.opponentScore)} points`;

  return { rounds, finalScore, winner, highlight };
}

// ─── Coin reward for duel result ─────────────────────────────────────────────

export function computeDuelReward(
  winner: 'challenger' | 'opponent' | 'draw',
  wagered: number
): { winnerCoins: number; loserCoins: number } {
  if (winner === 'draw') {
    return { winnerCoins: wagered, loserCoins: wagered };
  }
  const winnerCoins = Math.round(wagered * 1.8);
  const loserCoins = Math.round(wagered * 0.2);
  return { winnerCoins, loserCoins };
}
