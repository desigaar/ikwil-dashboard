import { store } from "../../index";
import firebase from "firebase/app";

export const createMeal = (meal: iMeal, profile: any, id: string) => {
  const ref = firebase
    .firestore()
    .collection("meals")
    .doc();
  ref
    .set({
      name: meal.name,
      price: meal.price,
      ingredients: meal.ingredients,
      isHallal: meal.isHallal,
      isVegan: meal.isVegan,
      isVegetarian: meal.isVegetarian,
      createdBy: profile.firstName + " " + profile.lastName,
      creatorID: id,
      id: ref.id,
      isActive: false
    })
    .then(() => {
      store.dispatch({ type: "CREATE_MEAL_SUCCESS", meal });
    })
    .catch((err: any) => {
      store.dispatch({ type: "CREATE_MEAL_ERROR", err });
      console.error("err", err);
    });

  return store.dispatch({ type: "CREATE_MEAL_SUCCESS", meal });
};

export const EditMeal = (
  meal: any,
  profile: any,
  id: string,
  docId: string
) => {
  firebase
    .firestore()
    .collection("meals")
    .doc(docId)
    .set({
      name: meal.name,
      price: meal.price,
      ingredients: meal.ingredients,
      isHallal: meal.isHallal,
      isVegan: meal.isVegan,
      isActive: meal.isActive,
      isVegetarian: meal.isVegetarian,
      createdBy: profile.firstName + " " + profile.lastName,
      creatorID: id
    })
    .then(() => store.dispatch({ type: "EDIT_MEAL_SUCCESS" }))
    .catch(err => store.dispatch({ type: "EDIT_MEAL_ERROR", err }));
};

export const DeleteMeal = (docId: string) => {
  firebase
    .firestore()
    .collection("meals")
    .doc(docId)
    .delete()
    .then(() => store.dispatch({ type: "DELETE_MEAL_SUCCESS" }))
    .catch(err => store.dispatch({ type: "DELETE_MEAL_ERROR", err }));
};