import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

const PartyRef = firestore().collection('Parties');

class Party {
  emailPlayersInGame: string[];
  partyCreatorEmail: string;
  partyStatus: Boolean;
  partyId = PartyRef.doc().id;

  constructor(
    emailPlayersInGame: string[] = [],
    partyCreatorEmail: string = '',
    partyStatus: Boolean = true,
  ) {
    this.emailPlayersInGame = emailPlayersInGame;
    this.partyCreatorEmail = partyCreatorEmail;
    this.partyStatus = partyStatus;
  }

  // ajoute une partie dans la base de donnée
  public addParty = async (): Promise<{id: string} | undefined> => {
    try {
      PartyRef.get().then(querySnapshot => {
        Promise.all(querySnapshot.docs.map(doc => doc.ref.delete()))
          .then(async () => {
            console.log(
              'Tous les documents de la sous-collection ont été supprimés.',
            );
            const docRef = await PartyRef.add({
              partyId: this.partyId,
              emailPlayersInGame: this.emailPlayersInGame,
              partyCreatorEmail: this.partyCreatorEmail,
              partyStatus: this.partyStatus,
            });
          })
          .catch(error => {
            console.error(
              'Erreur lors de la suppression des documents :',
              error,
            );
          });
      });
      console.log('Party added!');
      return {id: this.partyId};
    } catch (error) {
      console.log(error);
    }
  };

  // ajoute un joueur a une partie
  public addPlayer = async (email: string, partyId: string) => {
    try {
      const snapshots = await PartyRef.where('partyId', '==', partyId).get();
      if (!snapshots.empty) {
        const playersInGame = snapshots.docs[0].data().emailPlayersInGame;
        playersInGame.push(email);
        await snapshots.docs[0].ref.update({emailPlayersInGame: playersInGame});
        console.log('Player added to the party');
      } else {
        console.log('No document found for this partyId');
      }
    } catch (error) {
      console.log(error);
    }
  };

  public async setPartyToTrues(partyId: string) {
    const snapshots = await PartyRef.where('partyId', '==', partyId).get();
    if (!snapshots.empty) {
      snapshots.docs[0].data().partyStatus;
      await snapshots.docs[0].ref.update({
        partyStatus: true,
      });
      console.log('Party start');
    } else {
      console.log('No document found for this partyId');
    }
  }

  public getParties = async () => {
    const snapshot = (await PartyRef.where('partyStatus', '==', false).get())
      .docs;
    let partiesList: FirebaseFirestoreTypes.DocumentData[] = [];
    snapshot.forEach(partie => {
      partiesList.push(partie.data());
    });
    return partiesList;
  };

  public getPlayersInParty = async (partyId: string) => {
    try {
      const snapshots = await PartyRef.where('partyId', '==', partyId).get();
      if (!snapshots.empty) {
        const playersInGame = snapshots.docs[0].data().emailPlayersInGame;
        console.log(playersInGame);
        return playersInGame;
      } else {
        console.log('Aucun document trouvé pour ce partyId');
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export {Party};
