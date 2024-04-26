import re
import json

def clean_json_string(self, json_str):
    """Clean JSON String capturing only the value between curly braces

    Args:
        json_str (str): uncleaned string 

    Returns:
        str: cleaned string
    """
    # Define a regex pattern to match everything before and after the curly braces
    pattern = r'^.*?({.*}).*$'
    # Use re.findall to extract the JSON part from the string
    matches = re.findall(pattern, json_str, re.DOTALL)
    if matches:
        # If there's a match, return the first one (should be the JSON)
        return matches[0]
    else:
        # If no match is found, return None
        return None


def extract_json_objects(string):
    json_object_str = "{"
    start_index = string.find('"')
    
    while start_index != -1:
        end_index = string.find('",', start_index + 1)
        if end_index != -1:
            json_str = string[start_index:end_index+1]
            
            try:
                json.loads('{' + json_str + "}")
                json_object_str += json_str +","
            except json.JSONDecodeError:
                pass
            
            start_index = string.find('"', end_index + 1)
        # elif string.find('"}', start_index + 1) != -1:
        #     end_index = string.find('"}', start_index + 1)
        #     json_str = string[start_index:end_index]
            
        #     try:
        #         json.loads('{' + json_str + "}")
        #         json_object_str += json_str
        #     except json.JSONDecodeError:
        #         pass
        else:
            break
            
    return json_object_str + "}"
