import "./loader.scss";

const Loader = ({ message }) => {
  return (
    <div className="loader__container">
      <div className="loadingio-spinner-wedges-lih1xtea5hd">
        <div className="ldio-i9szrwkta0d">
          <div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
            <div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="loader__message">{message}</div>
    </div>
  );
};

export default Loader;
