import { Fragment, useState } from "react";
interface props {
  item: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}
function ListGroup({ item, heading, onSelectItem }: props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <Fragment>
      <h1>{heading}</h1>
      {item.length === 0 && <p>No item found</p>}
      <ul className="list-group">
        {item.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
export default ListGroup;
