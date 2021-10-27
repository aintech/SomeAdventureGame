import "./wiki-page.scss";

const WikiPage = () => {
  return (
    <div className="wiki-page">
      <h2 className="wiki-page__title">Some Adventure Game WIKI</h2>
      <p className="wiki-page__description">
        Сначала нанимаем героев в таверне, затем в гильдии отправляем их на задание. Сражение с противниками простой кликер - щелкайте по ним чтобы
        победить и собирайте выпадающее золото. На уровне с сундуков кликайте по нему загоняя в выделенный кружок.
      </p>
    </div>
  );
};

export default WikiPage;
