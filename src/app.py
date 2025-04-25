import streamlit as st
from utils import extract_text_from_pdf, get_highlighted_terms, answer_query
import base64
import io

st.set_page_config(layout="wide")
#st.title("📑 Form Assistant")
st.markdown(
    """
    <h2 style='text-align: left; font-size: 50px;'>📑  Form Assistant</h2>
    """,
    unsafe_allow_html=True
)
st.markdown("---------------")
st.write(" ")

def show_pdf(file):
    # Read file and encode to base64
    base64_pdf = base64.b64encode(file.read()).decode('utf-8')
    # Embed PDF in HTML
    pdf_display = f'<iframe src="data:application/pdf;base64,{base64_pdf}" width="100%" height="950" type="application/pdf"></iframe>'
    st.markdown(pdf_display, unsafe_allow_html=True)

# Sidebar upload
with st.sidebar:
    st.header("Upload Legal Form")
    uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")
    #if uploaded_file:
        #show_pdf(uploaded_file)

# Split screen layout
#left, right = st.columns(2)
left, right, righter = st.columns(3)

def does_start_with_number(s):
    return s[0].isdigit()

# Handle file + chatbot interaction
if uploaded_file:
    #form_text = extract_text_from_pdf(uploaded_file)
    #highlighted_terms = get_highlighted_terms(form_text)
    # Extract text for GPT term extraction
    if "terms" not in st.session_state:
        form_text = extract_text_from_pdf(uploaded_file)
        st.session_state["terms"] = get_highlighted_terms(form_text)

    # Extract terms with GPT
    #highlighted_terms = get_highlighted_terms(form_text)
    highlighted_terms = st.session_state["terms"]

    if "highlighted_pdf" not in st.session_state:

        # Reset file pointer before using it again
        uploaded_file.seek(0)
        st.session_state["highlighted_pdf"] = extract_text_from_pdf(uploaded_file, highlighted_terms)

    # Highlight the terms on the PDF itself
    #highlighted_pdf = extract_text_from_pdf(uploaded_file, terms_to_highlight=highlighted_terms)
    # Use cached highlighted PDF
    highlighted_pdf = st.session_state["highlighted_pdf"]

    # Offer download + display highlighted PDF
   #st.download_button("Download Highlighted PDF", highlighted_pdf, file_name="highlighted.pdf")
    #show_pdf(io.BytesIO(highlighted_pdf))  # Replace the initial PDF display


    with left:
        #st.subheader("📄 Uploaded Legal Form (Terms to Watch)")
        #for term in highlighted_terms:
            #st.markdown(f"🔍 **{term}**")
        show_pdf(io.BytesIO(highlighted_pdf))
        st.write(" ")
        st.download_button("Download Highlighted PDF", highlighted_pdf, file_name="highlighted.pdf")

    with right:
        st.subheader("✍️ Legal Terms to Watch")
        for term in highlighted_terms:
            if term != '' and does_start_with_number(term):
                st.markdown(f"🔍 {term}")
            else: 
                st.markdown(f"{term}")

    with righter:
        st.subheader("💬 Ask About This Form")
        user_query = st.text_input("Ask ImmAI a question about your uploaded form here:")

        if user_query:
            with st.spinner("Getting your answer..."):
                response = answer_query(user_query)
                st.markdown("**Answer:**")
                st.write(response)
