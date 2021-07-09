import query from "./db.js";

const adjustItems = (heroId, type, amount) => {
  return query(
    "adjustItems",
    `merge into public.hero_item hi 
     values ($1 as hero_id, $2 as type, $3 as amount) v
     on v.hero_id = hi.hero_id and v.type = hi.type
     when not matched
        insert values (v.hero_id, v.type, v.amount)
     when matched
        update set amount = amount + v.amount`,
    [heroId, type, amount]
  );
};

const adjustItemsById = (itemId, amount) => {
  return query(
    "adjustItems",
    `update public.hero_item set amount = amount + $2 where id = $1`,
    [itemId, amount]
  );
};

export { adjustItems, adjustItemsById };
