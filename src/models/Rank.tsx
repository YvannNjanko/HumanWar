import firestore from '@react-native-firebase/firestore';

const RankRef = firestore().collection('Ranks');

class Rank {
  partyId: string;

  constructor(partyId: string) {
    this.partyId = partyId;
  }

  // Ajoute ou met à jour le score d'un joueur
  public updatePlayerScore = async (email: string, score: number) => {
    try {
      const formattedEmail = email.replace(/\./g, ',');
      const rankDoc = await RankRef.doc(this.partyId).get();
      if (rankDoc.exists) {
        await RankRef.doc(this.partyId).update({
          [`scores.${formattedEmail}`]: score,
        });
      } else {
        await RankRef.doc(this.partyId).set({
          scores: {
            [formattedEmail]: score,
          },
          partyId: this.partyId,
          gameFinished: false,  // Ajoutez ce champ pour indiquer si le jeu est terminé
          winner: '',           // Ajoutez ce champ pour indiquer le gagnant
        });
      }
      console.log('Player score updated!');
    } catch (error) {
      console.log(error);
    }
  };

  // Met à jour le statut du jeu et le gagnant
  public updateGameStatus = async (status: boolean, winner: string) => {
    try {
      await RankRef.doc(this.partyId).update({
        gameFinished: status,
        winner: winner,
      });
      console.log('Game status updated!');
    } catch (error) {
      console.log(error);
    }
  };

  // Récupère les scores des joueurs
  public getPlayerScores = async () => {
    try {
      const rankDoc = await RankRef.doc(this.partyId).get();
      if (rankDoc.exists) {
        const rankData = rankDoc.data();
        return rankData ? rankData.scores : {};
      }
      return {};
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  // Récupère le statut du jeu
  public getGameStatus = async () => {
    try {
      const rankDoc = await RankRef.doc(this.partyId).get();
      if (rankDoc.exists) {
        const rankData = rankDoc.data();
        return rankData ? rankData.gameFinished : false;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Récupère le gagnant du jeu
  public getGameWinner = async () => {
    try {
      const rankDoc = await RankRef.doc(this.partyId).get();
      if (rankDoc.exists) {
        const rankData = rankDoc.data();
        return rankData ? rankData.winner : '';
      }
      return '';
    } catch (error) {
      console.log(error);
      return '';
    }
  };
}

export { Rank };
