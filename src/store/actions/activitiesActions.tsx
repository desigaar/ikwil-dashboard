import { store } from "../../index";
import firebase from "firebase/app";

export const createActivity = (
  activity: iActivity,
  profile: any,
  id: string,
  dayToPush: iOnce | undefined,
  daysToPush: iDay[] | undefined,
  repeats: boolean
) => {
  let dateToSet: any = {
    name: activity.name,
    room: activity.room,
    category: "categories/" + activity.category,
    organisers: activity.organisers,
    createdBy: profile.firstName + " " + profile.lastName,
    creatorID: id,
    repeats: repeats
  };
  if (typeof dayToPush !== "undefined") {
    dateToSet.day = dayToPush;
  }
  if (typeof daysToPush !== "undefined") {
    dateToSet.days = daysToPush;
  }
  const ref = firebase
    .firestore()
    .collection("activities")
    .doc();
  ref
    .set(dateToSet)
    .then(() => {
      store.dispatch({ type: "CREATE_ACTIVITY_SUCCESS", activity });
    })
    .catch((err: any) => {
      store.dispatch({ type: "CREATE_ACTIVITY_ERROR", err });
      console.error("err", err);
    });

  return store.dispatch({ type: "CREATE_ACTIVITY_SUCCESS", activity });
};

export const EditActivity = (
  activity: iActivity,
  profile: any,
  id: string,
  docId: string,
  dayToPush: iOnce | undefined,
  daysToPush: iDay[] | undefined,
  repeats: boolean
) => {
  let dateToSet: any = {
    name: activity.name,
    room: activity.room,
    category: "categories/" + activity.category,
    organisers: activity.organisers,
    createdBy: profile.firstName + " " + profile.lastName,
    creatorID: id,
    repeats: repeats
  };
  if (typeof dayToPush !== "undefined") {
    dateToSet.day = dayToPush;
  }
  if (typeof daysToPush !== "undefined") {
    dateToSet.days = daysToPush;
  }
  firebase
    .firestore()
    .collection("activities")
    .doc(docId)
    .set(dateToSet)
    .then(() => store.dispatch({ type: "EDIT_ACTIVITY_SUCCESS" }))
    .catch(err => store.dispatch({ type: "EDIT_ACTIVITY_ERROR", err }));
};

export const DeleteActivity = (docId: string) => {
  firebase
    .firestore()
    .collection("activities")
    .doc(docId)
    .delete()
    .then(() => store.dispatch({ type: "DELETE_ACTIVITY_SUCCESS" }))
    .catch(err => store.dispatch({ type: "DELETE_ACTIVITY_ERROR", err }));
};
