export const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
}

export const thumb = {
  display: 'inline-flex',
  borderRadius: 10,
  marginBottom: 8,
  marginRight: 8,
  width: 'auto',
  height: 90,
  padding: 4,
  border: 'none',
  position: 'relative',
  left: '40%',
  bottom: 100,
  filter: 'opacity(75%)'
}

export const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

export const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
}

export const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#cecece',
  borderStyle: 'dashed',
  backgroundColor: '#eaeaea',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

export const activeStyle = {
  borderColor: '#2196f3'
};

export const acceptStyle = {
  borderColor: '#00e676'
};

export const rejectStyle = {
  borderColor: '#ff1744'
};
