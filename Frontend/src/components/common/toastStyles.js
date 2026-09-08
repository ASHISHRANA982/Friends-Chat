const toastBaseStyle = {
  background: '#12232D',
  borderRadius: '8px',
  padding: '14px 18px',
  fontSize: '14px',
  fontWeight: '500',
};

export const toastStyles = {
  success: {
    ...toastBaseStyle,
    color: '#E8FFF9',
    border: '1px solid #00B894',
    borderLeft: '5px solid #00B894',
    boxShadow: '0 8px 25px rgba(0, 184, 148, 0.20)',
  },

  error: {
    ...toastBaseStyle,
    color: '#FFECEC',
    border: '1px solid #FF5C5C',
    borderLeft: '5px solid #FF5C5C',
    boxShadow: '0 8px 25px rgba(255, 92, 92, 0.20)',
  },

  warning: {
    ...toastBaseStyle,
    color: '#FFF7DF',
    border: '1px solid #F4B942',
    borderLeft: '5px solid #F4B942',
    boxShadow: '0 8px 25px rgba(244, 185, 66, 0.20)',
  },

  info: {
    ...toastBaseStyle,
    color: '#EAF7FF',
    border: '1px solid #38A8FF',
    borderLeft: '5px solid #38A8FF',
    boxShadow: '0 8px 25px rgba(56, 168, 255, 0.20)',
  },
};