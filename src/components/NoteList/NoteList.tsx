import css from "./NoteList.module.css";
import { type Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
  onDelete: (noteData: {}) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((item) => (
        <li key={item.id} className={css.listItem}>
          <h2 className={css.title}>{item.title}</h2>

          <p className={css.content}>{item.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{item.tag}</span>

            <button className={css.button} onClick={() => onDelete(item.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
