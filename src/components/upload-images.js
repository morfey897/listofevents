import { useCallback, useMemo } from "react";
import { GridList, GridListTile, GridListTileBar, IconButton, Box } from "@material-ui/core";
import { AddAPhoto as ImageIcon, InsertPhoto as BlankIcon, Delete as DeleteIcon, ArrowLeft as PreviosIcon, ArrowRight as NextIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { swap } from "../helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden',
    // backgroundColor: theme.palette.background.paper

    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(3)
  },
  // gridList: {
  //   flexWrap: 'nowrap',
  //   // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
  //   transform: 'translateZ(0)',
  // },
  title: {
    color: theme.palette.primary.contrastText,
    overflow: "hidden"
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));

function concatFiles(array1, array2) {
  const uniq = [...array1];
  for (let i = 0; i < array2.length; i++) {
    let f = array2[i];
    let index = uniq.findIndex(e => e.name == f.name);
    if (index != -1) {
      uniq.splice(index, 1);
    }
    uniq.push(f);
  }
  return uniq;
}

function UploadImages({ images, maxFiles, showItems = 1, onChange }) {

  const classes = useStyles();

  const onUploadImage = useCallback((event) => {
    let files = event.target.files;
    if (!files || !files.length) return;
    onChange((images) => {
      let total = concatFiles(images, files);
      let result = maxFiles == undefined ? total : total.slice(-maxFiles);
      event.target.value = "";
      return result;
    });
  }, []);

  const onDelete = useCallback((type, name) => {
    if (type === "url") {
      onChange(images => images.filter((file) => file._id != name));
    } else if (type === "file") {
      onChange(images => images.filter((file) => file.name != name));
    }
  }, []);
  const onNextPrior = useCallback((type, name) => {
    if (type === "url") {
      onChange(images => swap(images, images.findIndex((file) => file._id == name), 1));
    } else if (type === "file") {
      onChange(images => swap(images, images.findIndex((file) => file.name == name), 1));
    }
  }, []);

  const onPrevPrior = useCallback((type, name) => {
    if (type === "url") {
      onChange(images => swap(images, images.findIndex((file) => file._id == name), -1));
    } else if (type === "file") {
      onChange(images => swap(images, images.findIndex((file) => file.name == name), -1));
    }
  }, []);

  const items = useMemo(() => {
    let result = images.map(data => {
      if (data instanceof File) {
        return { title: data.name.replace(/\.\w+$/, ""), file: data, type: "file" };
      } else {
        return { title: data.url.split("/").slice(-1)[0], file: { url: data.url, name: data._id }, type: "url" };
      }
    });
    if (maxFiles != undefined && result.length < maxFiles) {
      result = result.concat({ title: "plus", type: "add" });
    }
    let add = showItems - result.length;
    return add > 0 ? result.concat(new Array(add).fill().map((_, i) => ({ title: `blank${i}`, type: "blank" }))) : result;
  }, [images, maxFiles, showItems]);

  return <>
    <div className={classes.root}>
      <GridList cols={showItems} cellHeight={160}>
        {items.map(({ title, type, file }) => (
          <GridListTile key={title} cols={1}>
            {type == "add" &&
              <label >
                <input accept="image/png, image/jpeg" style={{ display: "none" }} type="file" multiple={maxFiles != 1} onChange={onUploadImage} />
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <ImageIcon style={{ fontSize: 128 }} />
                </IconButton>
              </label>
            }
            {(type == "url" || type == "file") && <>
              <img src={type == "url" ? file.url : URL.createObjectURL(file)} alt={title} height={160} />
              <GridListTileBar
                title={title}
                subtitle={
                  <Box>
                    <IconButton color="primary" size={"small"} aria-label={`previous ${title}`} onClick={() => onPrevPrior(type, file.name)}>
                      <PreviosIcon />
                    </IconButton>
                    <IconButton color="primary" size={"small"} aria-label={`next ${title}`} onClick={() => onNextPrior(type, file.name)}>
                      <NextIcon />
                    </IconButton>
                  </Box>
                }
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
                actionIcon={
                  <IconButton color="secondary" aria-label={`delete ${title}`} onClick={() => onDelete(type, file.name)}>
                    <DeleteIcon />
                  </IconButton>
                }
              />
            </>}
            {type == "blank" &&
              <IconButton color="primary" disabled aria-label="blank picture" component="span">
                <BlankIcon style={{ fontSize: 128 }} />
              </IconButton>
            }
          </GridListTile>
        ))}
      </GridList>
    </div>
  </>;
}

export default UploadImages;