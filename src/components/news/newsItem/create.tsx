import React, { useState } from "react";
import { connect } from "react-redux";
import { createNewsItem } from "../../../store/actions/newsItemActions";
import { Redirect } from "react-router-dom";

interface Props {
  profile: any;
  userId: string;
}

const Create: React.FC<Props> = ({ profile, userId }) => {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [redirect, setRedirect] = useState<boolean>(false);
  const [img, setImg] = useState<any>(undefined);
  const [imgPreview, setImgPreview] = useState<any>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNewsItem({ title, text }, profile, userId, img);
    setRedirect(true);
  };
  const handleImageUpload = (e: any) => {
    e.preventDefault();
    if (typeof e.target.files[0] !== "undefined") {
      setImgPreview(URL.createObjectURL(e.target.files[0]));
      setImg(e.target.files[0]);
    }
  };
  return (
    <div className="s-cms">
      <div className="s-cms__form-conatiner">
        <h2 className="s-cms__header">Nieuw nieuwsbericht</h2>
        <form onSubmit={e => handleSubmit(e)}>
          <div className="o-inputfield">
            <label>Titel</label>
            <input
              className="o-inputfield__input"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="o-inputfield">
            <label>Bericht</label>
            <textarea
              className="o-inputfield__input"
              required
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
          <div className="o-inputfield">
            <label>Afbeelding toevoegen</label>
            <img
              className="o-inputfield__upload-preview"
              src={imgPreview}
              alt="preview"
            />
            <input
              className="o-inputfield__file-upload"
              type="file"
              name="imgToUpload"
              id="imgToUplaod"
              onChange={e => handleImageUpload(e)}
            />
          </div>
          <button>Plaats nieuwsbericht</button>
        </form>
      </div>
      {redirect ? <Redirect to="/admin/news" /> : null}
    </div>
  );
};
const mapStateToProps = (state: any) => {
  return {
    profile: state.firebase.profile,
    userId: state.firebase.auth.uid
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    createNewsItem: (newsItem: any, profile: any, userId: string, img: any) =>
      dispatch(createNewsItem(newsItem, profile, userId, img))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
