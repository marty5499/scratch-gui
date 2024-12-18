import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import DragConstants from '../../lib/drag-constants';
//import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import SpriteSelectorItem from '../../containers/sprite-selector-item.jsx';
import styles from './backpack.css';

// TODO make sprite selector item not require onClick
const noop = () => {};

const dragTypeMap = { // Keys correspond with the backpack-server item types
    costume: DragConstants.BACKPACK_COSTUME,
    sound: DragConstants.BACKPACK_SOUND,
    script: DragConstants.BACKPACK_CODE,
    sprite: DragConstants.BACKPACK_SPRITE
};

const labelMap = defineMessages({
    costume: {
        id: 'gui.backpack.costumeLabel',
        defaultMessage: 'costume',
        description: 'Label for costume backpack item'
    },
    sound: {
        id: 'gui.backpack.soundLabel',
        defaultMessage: 'sound',
        description: 'Label for sound backpack item'
    },
    script: {
        id: 'gui.backpack.scriptLabel',
        defaultMessage: 'script',
        description: 'Label for script backpack item'
    },
    sprite: {
        id: 'gui.backpack.spriteLabel',
        defaultMessage: 'sprite',
        description: 'Label for sprite backpack item'
    }
});

const Backpack = ({
    blockDragOver,
    containerRef,
    contents,
    dragOver,
    error: propsError,
    expanded,
    intl,
    loading,
    showMore,
    onToggle,
    onDelete,
    onMouseEnter,
    onMouseLeave,
    onMore,
    vm
}) => {
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const handleClick = () => {
        if (!isPanelVisible && !isAnimating) {
            setIsAnimating(true);
            setIsPanelVisible(true);
            setTimeout(() => {
                setIsAnimating(false);
            }, 500);
        }
    };
    
    const handleClosePanel = () => {
        setIsPanelVisible(false);
    };

    const handleHeaderClick = e => {
        e.preventDefault();
        handleClick();
        if (onToggle) onToggle();
    };

    const showMessage = message => {
        // eslint-disable-next-line no-alert
        alert(message);
    };

    const handleSubmit = () => {
        if (!vm) {
            showMessage('無法存取專案資料');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        vm.saveProjectSb3()
            .then(content => {
                const formData = new FormData();
                const blob = new Blob([content], {type: 'application/x.scratch.sb3'});
                formData.append('file', blob, 'project.sb3');

                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/judge/action', true);
                xhr.responseType = 'json';

                xhr.upload.onprogress = event => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        setUploadProgress(Math.round(progress));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        setIsUploading(false);
                        const response = xhr.response;
                        showMessage(JSON.stringify(response, null, 2));
                        handleClosePanel();
                    } else {
                        setIsUploading(false);
                        showMessage('上傳失敗，請重試');
                    }
                };

                xhr.onerror = () => {
                    setIsUploading(false);
                    showMessage('上傳失敗，請檢查網路連線');
                };

                xhr.send(formData);
            })
            .catch(err => {
                setIsUploading(false);
                showMessage('儲存專案時發生錯誤');
                console.error(err);
            });
    };

    const handleButtonClick = handler => () => handler();

    return (
        <div className={styles.backpackContainer}>
            <div
                className={styles.backpackHeader}
                onClick={handleHeaderClick}
            >
                {onToggle ? (
                    <FormattedMessage
                        defaultMessage="過關條件"
                        description="Button to open the backpack"
                        id="gui.backpack.header.conditions"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="過關條件"
                        description="Button to open the backpack tooltip"
                        id="gui.backpack.header.tooltip"
                    />
                )}
            </div>
            
            <div 
                className={classNames(styles.slidePanel, {
                    [styles.slidePanelVisible]: isPanelVisible
                })}
            >
                <button
                    className={styles.closeButton}
                    onClick={handleClosePanel}
                >
                    <span>{'離開'}</span>
                </button>
                
                <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={isUploading}
                >
                    <span>
                        {isUploading ? `上傳中 ${uploadProgress}%` : '送出'}
                    </span>
                </button>
                {isUploading && (
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill}
                            style={{width: `${uploadProgress}%`}}
                        />
                    </div>
                )}
            </div>
            
            {expanded ? (
                <div
                    className={classNames(styles.backpackList, {
                        [styles.dragOver]: dragOver || blockDragOver
                    })}
                    ref={containerRef}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {propsError ? (
                        <div className={styles.statusMessage}>
                            <FormattedMessage
                                defaultMessage="Error loading backpack"
                                description="Error backpack message"
                                id="gui.backpack.errorBackpack"
                            />
                        </div>
                    ) : (
                        loading ? (
                            <div className={styles.statusMessage}>
                                <FormattedMessage
                                    defaultMessage="Loading..."
                                    description="Loading backpack message"
                                    id="gui.backpack.loadingBackpack"
                                />
                            </div>
                        ) : (
                            contents.length > 0 ? (
                                <div className={styles.backpackListInner}>
                                    {contents.map(item => (
                                        <SpriteSelectorItem
                                            className={styles.backpackItem}
                                            costumeURL={item.thumbnailUrl}
                                            details={item.name}
                                            dragPayload={item}
                                            dragType={dragTypeMap[item.type]}
                                            id={item.id}
                                            key={item.id}
                                            name={intl.formatMessage(labelMap[item.type])}
                                            selected={false}
                                            onClick={noop}
                                            onDeleteButtonClick={onDelete}
                                        />
                                    ))}
                                    {showMore && (
                                        <button
                                            className={styles.more}
                                            onClick={onMore}
                                        >
                                            <FormattedMessage
                                                defaultMessage="More"
                                                description="Load more from backpack"
                                                id="gui.backpack.more"
                                            />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.statusMessage}>
                                    <FormattedMessage
                                        defaultMessage="Backpack is empty"
                                        description="Empty backpack message"
                                        id="gui.backpack.emptyBackpack"
                                    />
                                </div>
                            )
                        )
                    )}
                </div>
            ) : null}
        </div>
    );
};

Backpack.propTypes = {
    blockDragOver: PropTypes.bool,
    containerRef: PropTypes.func,
    contents: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        thumbnailUrl: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string
    })),
    dragOver: PropTypes.bool,
    error: PropTypes.bool,
    expanded: PropTypes.bool,
    intl: intlShape,
    loading: PropTypes.bool,
    onDelete: PropTypes.func,
    onMore: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onToggle: PropTypes.func,
    showMore: PropTypes.bool,
    vm: PropTypes.shape({
        saveProjectSb3: PropTypes.func
    })
};

Backpack.defaultProps = {
    blockDragOver: false,
    contents: [],
    dragOver: false,
    expanded: false,
    loading: false,
    showMore: false,
    onMore: null,
    onToggle: null,
    vm: null
};

export default injectIntl(Backpack);
