import { useState, useEffect, forwardRef, useRef } from 'react';
import styles from './Feed.module.css';
import { BiCheck, BiEditAlt } from 'react-icons/bi';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
import { FiDownload } from 'react-icons/fi';

const FeedItem = forwardRef(({ feedId, date, image, content, setFeeds, feeds }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [img, setImg] = useState(null);
  const [isDownload, setIsDownload] = useState(false);

  const onDownloadBtn = () => {
    // var node = document.getElementById('toImage');

    domtoimage
      .toBlob(document.querySelector('#downloadImg'))
      // .toBlob(node)
      .then((blob) => {
        saveAs(blob, 'card.png');
      })
      .catch((error) => {
        console.error('Error capturing image:', error);
      });

    setIsDownload(false);
  };

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const imageUrl = `/get_feeds/${image}`;
        // console.log("Image URL:", imageUrl);
        setImg(imageUrl);
      } catch (error) {
        console.error('Error fetching img:', error);
      }
    };

    fetchImg();
  }, [image]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    const fetchDiaryUpdate = async () => {
      try {
        // console.log("Editing diary:", feedId, editedContent);
        const response = await fetch(`/modify_diary/${feedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedContent,
          }),
        });
        const data = await response.json();
        if (data.status == "success") {
          const updatedFeeds = feeds.map((feed) =>
            feed.id === feedId ? { ...feed, content: editedContent } : feed
          );
          setFeeds(updatedFeeds);
        }
        else
          console.error("Failed to update diary:", data);
      } catch (error) {
        console.error("Error updating diary:", error);
      }
    }
    fetchDiaryUpdate();
  };

  const handleInputChange = (e) => {
    setEditedContent(e.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.toLocaleString('default', {
      month: 'long',
      timeZone: 'UTC',
    });
    const day = date.getUTCDate();
    return `${year}년 ${month} ${day}일`;
  };

  const formattedDate = formatDate(date);

  return (
    <div className={styles.feed_item} ref={ref} id="downloadImg">
      <div className={styles.feed_item_header}>
        <div className={styles.date_text} id="toImage">
          {formattedDate}의 일기
        </div>
        <div>
          {isDownload ? (
            <> </>
          ) : isEditing ? (
            <button onClick={handleSave} className={styles.save_button}>
              <BiCheck size={26} />
            </button>
          ) : (
            <button onClick={handleEdit} className={styles.edit_button}>
              <BiEditAlt size={22} />
            </button>
          )}
          {isDownload ? (
            <> </>
          ) : (
            <button
              onClick={() => {
                onDownloadBtn();
                setIsDownload(true);
              }}
              className={styles.saveImage_button}
            >
              <FiDownload size={22} />
            </button>
          )}
        </div>
      </div>
      <img src={img} alt="Feed" id="toImage" />
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={handleInputChange}
          className={styles.textarea}
        />
      ) : (
        <p className={styles.content} id="toImage">
          {content}
        </p>
      )}
    </div>
  );
});

export default FeedItem;
