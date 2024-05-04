const Message = ({ message }) => {

  return (
    <div className={`chat`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src="https://imgs.search.brave.com/jLTwrBSRPcoyhBJs1uPbMl500isS1N2O0JlI3BLUQoY/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvZmVhdHVy/ZWQvY29vbC1wcm9m/aWxlLXBpY3R1cmUt/ODdoNDZnY29iamw1/ZTR4dS5qcGc"
          />
        </div>
      </div>
      <div
        className={`chat-bubble text-white pb-2`}
      >
        Hi there whats Up?
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        12:00 PM
      </div>
    </div>
  );
};

export default Message;
