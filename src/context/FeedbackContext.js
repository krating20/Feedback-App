import { createContext, useState, useEffect } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState([])
  const [feedbackEdit, setFeedbackedit] = useState({
    item:{},
    edit: false
  })

  useEffect(() => {
    fetchFeedback()
}, [])

  const fetchFeedback = async () => {
    const response = await fetch(`/feedback?_sort=id_order=desc`)
    const data = await response.json()
    console.log(data)
    setFeedback(data)
    setIsLoading(false)
  }


//delete feedback
  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
        await fetch(`/feedback/${id}`, { method: 'DELETE' })

    
      setFeedback(feedback.filter((item) => item.id !== id));
    }
  }
//add feedback
  const addFeedback = async(newFeedback) => {
    const response = await fetch('/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      })
    const data = await response.json()
    setFeedback([data, ...feedback])
  }

  // update feedback item 
const updateFeedback = async(id,updItem) =>{
    const response = await fetch(`/feedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updItem),
      })
  
      const data = await response.json()



    setFeedback(feedback.map((item)=> item.id === id?{...item,...data}:item))
}


//set item to be updated 
  const editFeedback = (item) =>{
    setFeedbackedit(
        {item,
        edit: true}
    )
  }

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        feedbackEdit,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
};

export default FeedbackContext;
