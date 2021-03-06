import { ChangeEvent, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import styles from './modal.module.scss';
import { getGeoCodingApi } from 'services/geocoding';
import { ICoordinate, IResults } from 'types/location';

import Portal from './Portal';

interface IProps {
  showModal: boolean;
  handleChangeOption: () => void;
  handleAddOrModifyLocation: (coordinate: ICoordinate) => void;
}

const Modal = ({ handleChangeOption, showModal, handleAddOrModifyLocation }: IProps) => {
  const [text, setText] = useState('');
  const [apiStatus, setApiStatus] = useState('');
  const [locationList, setLocationList] = useState<IResults[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const optionRef = useRef<HTMLDivElement>(null);

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value);

  const handleClickOutSide = (e: MouseEvent | Event) => {
    const target = e.target as HTMLDivElement;
    if (showModal && !optionRef.current?.contains(target)) handleChangeOption();
  };

  const handleChangeLocation = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedLocation(e.currentTarget.value);
  };

  const getAdressApi = (e: FormEvent) => {
    e.preventDefault();
    getGeoCodingApi(text).then((res) => {
      setLocationList(res.data.results);
      setApiStatus(res.data.status);
      if (selectedLocation) {
        const coordinate = res.data.results[0].geometry.location;
        handleAddOrModifyLocation(coordinate);
        handleChangeOption();
      }
    });
  };

  useEffect(() => {
    if (showModal) document.addEventListener('mousedown', handleClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  });

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleChangeOption();
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Portal>
      <div className={styles.background}>
        <div className={styles.wrapper} ref={optionRef}>
          <h2>????????? ???????????????.</h2>
          <form action='' onSubmit={getAdressApi}>
            <input
              ref={inputRef}
              type='text'
              placeholder='??????'
              className={styles.textInput}
              value={text}
              onChange={handleChangeText}
            />
            <ul className={styles.locationList}>
              {apiStatus === 'ZERO_RESULTS' ? (
                <li className={styles.errorMsg}>?????? ????????? ????????????.</li>
              ) : (
                locationList.map((list: IResults) => (
                  <li key={list.place_id}>
                    <input
                      onChange={handleChangeLocation}
                      type='radio'
                      value={list.formatted_address}
                      name='location'
                    />
                    <label>{list.formatted_address}</label>
                  </li>
                ))
              )}
            </ul>
            <div className={styles.btnWrapper}>
              <button type='button' className={styles.cancel} onClick={handleChangeOption}>
                Cancel
              </button>
              <button type='button' onClick={getAdressApi}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
