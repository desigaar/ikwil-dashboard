import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { DeleteActivity } from "../../store/actions/activitiesActions";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Modal from "react-modal";
import { GetDayByNumber } from "../../functions/dates";
import ActiveOrganizer from "../organisers/activeOrganizer";
import { getSecondPart } from "../../functions/stringSplitting";
import { sortData } from "../../functions/activitySort";
import { GetPhoto } from "../../store/actions/imgActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActivityItem from "./activityItem";
import moment from "moment";
import "moment/locale/nl";
moment.locale("nl");

interface Props {
  activities?: iActivity[] | undefined;
  next?: any;
  previous?: any;
  carouselState?: any;
  goToSlide?: any;
}

const Summary: React.FC<Props> = ({ activities }) => {
  const firestore = useFirestore();
  const initSortedDays = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
  };

  const [sortedDays, setSortedDays] = useState<any>(initSortedDays);
  const [inititialActivities, setCheckActivities] = useState<any>(undefined);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [modalIsOpen, setIsOpen] = React.useState<boolean>(false);
  const [modalContent, setModalContent] = React.useState<any>(false);
  const [organisers, setOrganisers] = React.useState<any>(false);
  const [catergory, setCategory] = React.useState<any>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [currentSlide, setCurrentSlide] = React.useState<any>(0);
  const [img, setImg] = useState<any>(undefined);

  const getCategory = (activity: iActivity) => {
    setCategory([]);

    if (typeof activity !== "undefined") {
      if (typeof activity.category !== "undefined") {
        //Category fetch
        firestore
          .collection("categories")
          .doc(getSecondPart(activity.category, "/"))
          .get()
          .then((data: any) => {
            GetPhoto(data.data().icon)?.then((res: any) => {
              setImg(res);
            });
          });
      }
    }
  };

  const getOrganisers = (activity: iActivity) => {
    setOrganisers([]);
    if (
      typeof activity.organisers !== "undefined" &&
      activity.organisers.length > 0
    ) {
      //Organisers fetch
      let organisersIds: any = [];
      activity.organisers.forEach((organizer: any) => {
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
            setOrganisers(arr);
          })
        );
    }
  };

  Modal.setAppElement("#root");

  const openModal = (activity: iActivity) => {
    setIsOpen(true);
    setModalContent(activity);
    getOrganisers(activity);
    getCategory(activity);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (activities !== inititialActivities) {
      setCheckActivities(activities);
      setSortedDays(sortData(activities));
    }
  }, [activities, inititialActivities, sortedDays, initSortedDays]);

  let renderDays: any = [];

  if (typeof sortedDays !== "undefined" && sortedDays !== null) {
    Object.keys(sortedDays).forEach(function (key) {
      renderDays.push(
        <div key={key}>
          {sortedDays[key].length !== 0 ? (
            <>
              {sortedDays[key].map((activity: any) => {
                return (
                  <ActivityItem
                    action={() => {
                      if (isMoving !== true) {
                        openModal(activity);
                      }
                    }}
                    key={activity.id}
                    day={key}
                    activity={activity}
                  />
                );
              })}
            </>
          ) : (
            <div>Geen activiteiten vandaag!</div>
          )}
        </div>
      );
    });
  }
  const [initted, setInitted] = useState<boolean>(false);
  const ButtonGroup: React.FC<Props> = ({
    next,
    previous,
    carouselState,
    goToSlide,
  }) => {
    const { currentSlide } = carouselState;
    useEffect(() => {
      if (!initted) {
        let today = new Date();
        setInitted(true);
        goToSlide(today.getDay() - 1);
      }
    }, [currentSlide, goToSlide]);

    return (
      <div className="c-dayChanger">
        <button
          id="back"
          onClick={() => previous()}
          className={
            currentSlide !== 0
              ? "c-dayChanger__arrow"
              : "c-dayChanger__arrow disabled"
          }
        >
          <FontAwesomeIcon icon="chevron-left" />
        </button>
        <h3 className="c-dayChanger__date">
          {GetDayByNumber(currentSlide + 1)}
        </h3>
        <button
          disabled={currentSlide === 6}
          id="forward"
          onClick={() => next()}
          className={
            currentSlide !== 6
              ? "c-dayChanger__arrow"
              : "c-dayChanger__arrow disabled"
          }
        >
          <FontAwesomeIcon icon="chevron-right" />
        </button>
      </div>
    );
  };

  return (
    <>
      <h2 className="s-card-big__header">Activiteiten</h2>
      <Carousel
        responsive={responsive}
        infinite={false}
        draggable={true}
        containerClass="o-carousel"
        dotListClass="o-carousel__dots"
        sliderClass="o-carousel__slider"
        renderButtonGroupOutside={true}
        arrows={false}
        customButtonGroup={<ButtonGroup />}
        beforeChange={() => setIsMoving(true)}
        afterChange={(previousSlide, { currentSlide }) => {
          setIsMoving(false);
          setCurrentSlide(currentSlide);
        }}
      >
        {renderDays}
      </Carousel>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, .75)",
          },
        }}
      >
        <div
          className="ReactModal__Content__close-icon"
          onClick={closeModal}
        ></div>
        <div className="ReactModal__Content__wrapper__full">
          <div className="ReactModal__Content__title_wrapper">
            <img
              className="ReactModal__Content__title_wrapper__image"
              src={img}
              alt="previewImage"
            />
            {modalContent.name ? (
              <h2 className="ReactModal__Content__title_wrapper__title">
                {modalContent.name}
              </h2>
            ) : null}
          </div>
          Wordt gegeven op
          {modalContent.days
            ? " " +
              moment.weekdays(true, currentSlide) +
              " van " +
              modalContent.days[currentSlide].startTime +
              " tot " +
              modalContent.days[currentSlide].endTime
            : null}
          {modalContent.day
            ? " " +
              new Date(modalContent.day.date).toLocaleString("NL-nl", {
                weekday: "long",
              }) +
              " van " +
              modalContent.day.startTime +
              " tot " +
              modalContent.day.endTime
            : null}
          <br />
          <br />
          <p className="ReactModal__Content__text">
            {modalContent.description}
          </p>
          <br />
          {organisers.length > 0 ? (
            <h2 className="ReactModal__Content__title">Word gegeven door</h2>
          ) : null}
          {organisers.length > 0
            ? organisers.map((organizer: any) => {
                return (
                  <ActiveOrganizer organizer={organizer} key={organizer.id} />
                );
              })
            : null}
        </div>
      </Modal>
    </>
  );
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    GetPhoto: (path: string) => dispatch(GetPhoto(path)),
    DeleteActivity: (docId: string) => dispatch(DeleteActivity(docId)),
  };
};
export default connect(null, mapDispatchToProps)(Summary) as React.FC<Props>;
