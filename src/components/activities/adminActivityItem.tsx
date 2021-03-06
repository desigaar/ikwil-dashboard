import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { Link } from "react-router-dom";
import { DeleteActivity } from "../../store/actions/activitiesActions";
import { Redirect } from "react-router-dom";
import { getSecondPart } from "../../functions/stringSplitting";
import { GetPhoto } from "../../store/actions/imgActions";
interface Props {
  data?: any;
  activity: any;
}

const Activity: React.FC<Props> = ({ activity }) => {
  const firestore = useFirestore();

  const [safeDelete, setSafeDelete] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [category, setCategory] = useState<iCategory | undefined>(undefined);
  const [img, setImg] = useState<any>(undefined);

  useEffect(() => {
    if (typeof activity !== "undefined") {
      if (typeof activity.category !== "undefined") {
        firestore
          .collection("categories")
          .doc(getSecondPart(activity.category, "/"))
          .get()
          .then((data: any) => {
            setCategory(data.data());
            GetPhoto(data.data().icon)?.then((res: any) => {
              setImg(res);
            });
          });
      }
      if (
        typeof activity.organisers !== "undefined" &&
        activity.organisers.length > 0
      ) {
        let organisersIds: any = [];
        activity.organisers.forEach((organizer: iOrganizer) => {
          organisersIds.push(getSecondPart(organizer, "/"));
        });

        let arr: any = [];
        firestore
          .collection("organisers")
          .where("id", "in", organisersIds)
          .get()
          .then((data: any) =>
            data.docs.forEach((doc: any) => {
              arr.push(doc.data());
            })
          );
      }
    }
  }, [activity, firestore]);
  if (typeof activity !== "undefined") {
    const handleDelte = () => {
      if (typeof activity.id !== "undefined") {
        DeleteActivity(activity.id);
        setRedirect(true);
      }
    };

    if (!redirect) {
      return (
        <div className="c-adminItem" key={activity.id}>
          <div className="c-adminItem__top">
            <div className="c-adminItem__top__left">
              <div className="c-adminItem__image">
                {typeof category !== "undefined" ? (
                  <img src={img} alt="preview" />
                ) : null}
              </div>
            </div>
            <div className="c-adminItem__top__center">
              <h3 className="c-adminItem__title">{activity.name}</h3>
              <p className="c-adminItem__text">{activity.description}</p>
              <p className="c-adminItem__bold">{activity.room}</p>
            </div>
          </div>
          <div className="c-adminItem__bottom">
            <div></div>
            <div className="c-adminItem__buttons">
              <Link to={"/admin/activity/" + activity.id + "/edit"}>
                <button
                  onChange={e => {
                    e.preventDefault();
                  }}
                >
                  Edit
                </button>
              </Link>
              <button onClick={() => setSafeDelete(true)}>delete</button>
              {safeDelete ? (
                <div className="c-adminItem__popup">
                  Are you sure you want to delete it?
                  <button onClick={() => setSafeDelete(false)}>No</button>
                  <button onClick={() => handleDelte()}>yes</button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    } else {
      return <Redirect to={"/admin/activities"} />;
    }
  } else {
    return null;
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    DeleteActivity: (docId: string) => dispatch(DeleteActivity(docId)),
    GetPhoto: (path: string) => dispatch(GetPhoto(path))
  };
};

export default connect(null, mapDispatchToProps)(Activity) as React.FC<Props>;
