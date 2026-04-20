import { useState } from "react";

const DragList = ({ items, onReorder, renderItem }) => {
  const [dragged, setDragged] = useState(null);

  const handleDrop = (index) => {
    const updated = [...items];
    const draggedItem = updated[dragged];

    updated.splice(dragged, 1);
    updated.splice(index, 0, draggedItem);

    onReorder(updated);
  };

  return items.map((item, index) => (
    <div
      key={item.id}
      draggable
      onDragStart={() => setDragged(index)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDrop(index)}
    >
      {renderItem(item, index)}
    </div>
  ));
};

export default DragList;