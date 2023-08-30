import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import Uppy from "@uppy/core";
import { FileInput } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";

import { post, patch, destroy, getAuthToken } from "src/utils/requests";
import { useTheme } from "src/contexts/ThemeContext";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Checkbox from "src/components/design_system/checkbox";
import TextInput from "src/components/design_system/fields/textinput";
import TextArea from "src/components/design_system/fields/textarea";
import Divider from "src/components/design_system/other/Divider";
import Button from "src/components/design_system/button";
import { ToastBody } from "src/components/design_system/toasts";
import { Toolbox, Learn, Delete } from "src/components/icons";
import { H5, P2 } from "src/components/design_system/typography";
import { lightTextPrimary01, darkTextPrimary01 } from "src/utils/colors";

import { useWindowDimensionsHook } from "src/utils/window";
import { useProfileFetcher } from "src/hooks/use-profile-fetcher";

import cx from "classnames";
import styled, { css } from "styled-components";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { mobileStyles } from "@talentprotocol/design-system";
dayjs.extend(customParseFormat);

const ButtonsContainer = styled.div`
  height: 80%;
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;

  ${mobileStyles(css`
    flex-direction: column;
  `)}
`;

const SelectExperienceType = ({ mobile, goToNextStep }) => {
  return (
    <>
      <Modal.Header closeButton className="px-5">
        <H5 bold text="Select the experience type" />
      </Modal.Header>
      <Divider />
      <Modal.Body
        className={cx(
          "d-flex flex-column align-items-center justify-content-between",
          mobile ? "px-4 pt-4 pb-7" : "px-6 pt-5 pb-6"
        )}
        style={{
          maxHeight: mobile ? "" : "700px",
          overflowY: "overlay"
        }}
      >
        <ButtonsContainer>
          <Button type="white-subtle" size="extra-big" onClick={() => goToNextStep("Position")}>
            <Toolbox size={24} pathClassName="light-primary" color="#328AFF" />
            <P2 medium text="Position" />
          </Button>
          <Button type="white-subtle" size="extra-big" onClick={() => goToNextStep("Education")}>
            <Learn size={24} />
            <P2 medium text="Education" />
          </Button>
        </ButtonsContainer>
      </Modal.Body>
      <Divider />
    </>
  );
};

const returnYear = date => {
  if (date) {
    return dayjs(date).format("YYYY");
  } else {
    return "";
  }
};

const returnMonth = date => {
  if (date) {
    return dayjs(date).format("MMMM");
  } else {
    return "";
  }
};

const MilestoneExperience = ({
  mobile,
  changeAttribute,
  currentJourneyItem,
  goToPreviousStep,
  hide,
  saveMilestone,
  updateMilestone,
  deleteMilestone,
  mode,
  editType,
  validationErrors,
  uppyBanner,
  deleteImage
}) => {
  const [startMonth, setStartMonth] = useState(returnMonth(currentJourneyItem.start_date));
  const [startYear, setStartYear] = useState(returnYear(currentJourneyItem.start_date));
  const [endMonth, setEndMonth] = useState(returnMonth(currentJourneyItem.end_date));
  const [endYear, setEndYear] = useState(returnYear(currentJourneyItem.end_date));

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const yearOptions = (() => {
    const max = new Date().getFullYear() + 20;
    const min = 1970;

    const years = [];
    for (let i = max; i >= min; i--) {
      years.push(i);
    }
    return years;
  })();

  const CategoryOptions = ["Position", "Education"];

  useEffect(() => {
    if (startMonth != "" && startYear != "") {
      changeAttribute("start_date", dayjs(`${startMonth}-${startYear}`, "MMMM-YYYY").format("DD-MM-YYYY"));
    } else {
      changeAttribute("start_date", "");
    }
  }, [startMonth, startYear]);

  useEffect(() => {
    if (endMonth != "" && endYear != "") {
      changeAttribute("end_date", dayjs(`${endMonth}-${endYear}`, "MMMM-YYYY").format("DD-MM-YYYY"));
    } else {
      changeAttribute("end_date", "");
    }
  }, [endMonth, endYear]);

  return (
    <>
      <Modal.Header closeButton className="px-5">
        <H5 bold text={`${editType} ${currentJourneyItem.category}`} />
      </Modal.Header>
      <Divider />
      <Modal.Body
        className={cx(
          "d-flex flex-column align-items-center justify-content-between",
          mobile ? "px-4 pt-4 pb-7" : "px-6 pt-5 pb-6"
        )}
        style={{
          maxHeight: mobile ? "" : "700px",
          overflowY: "overlay"
        }}
      >
        {editType != "Add" && (
          <div className="w-100 mb-5">
            <label htmlFor="inputCategory">
              <P2 className="mb-2 text-primary-01" bold>
                Category
              </P2>
            </label>
            <div className="d-flex flex-row justify-content-between">
              <Form.Control
                as="select"
                onChange={e => changeAttribute("category", e.target.value)}
                value={currentJourneyItem.category}
                placeholder="Category"
                className="height-auto mr-2"
              >
                {CategoryOptions.map(category => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>
        )}
        <div className="w-100 mb-5">
          <TextInput
            title={currentJourneyItem.category === "Education" ? "Degree" : "Title"}
            onChange={e => changeAttribute("title", e.target.value)}
            value={currentJourneyItem.title}
            placeholder={
              currentJourneyItem.category === "Education" ? "Degree in Engineering" : "Senior Product Designer"
            }
            required={true}
            error={validationErrors?.title}
          />
        </div>
        <div className="w-100 mb-5">
          <TextInput
            title={currentJourneyItem.category === "Education" ? "School" : "Organization"}
            onChange={e => changeAttribute("institution", e.target.value)}
            value={currentJourneyItem.institution}
            placeholder={currentJourneyItem.category === "Education" ? "Stanford University" : "Talent Protocol"}
            required={true}
            error={validationErrors?.institution}
          />
        </div>
        <div className="w-100 mb-5">
          <TextArea
            title="Description"
            onChange={e => changeAttribute("description", e.target.value)}
            value={currentJourneyItem.description}
            rows={3}
            required={true}
            error={validationErrors?.description}
          />
        </div>
        <div className="align-self-start mb-5">
          <Checkbox
            className="form-check-input"
            checked={currentJourneyItem.inProgress}
            onChange={() => changeAttribute("in_progress", !currentJourneyItem.in_progress)}
          >
            <P2
              className="mr-1"
              text={
                currentJourneyItem.category === "Education"
                  ? "I am currently studying here"
                  : "I am currently working on this role"
              }
            />
          </Checkbox>
        </div>
        <div className="w-100 mb-5">
          <label htmlFor="inputStartMonth">
            <P2 className="mb-2 text-primary-01" bold>
              Start date <span className="text-danger">*</span>
            </P2>
          </label>
          <div className="d-flex flex-row justify-content-between">
            <Form.Control
              as="select"
              onChange={e => setStartMonth(e.target.value)}
              value={startMonth}
              placeholder="Month"
              className={cx("height-auto", "mr-2", validationErrors?.startDate && "border-danger")}
            >
              <option value=""></option>
              {monthOptions.map(month => (
                <option value={month} key={`start-${month}`}>
                  {month}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              as="select"
              onChange={e => setStartYear(e.target.value)}
              value={startYear}
              placeholder="Year"
              className={cx("height-auto", "ml-2", validationErrors?.startDate && "border-danger")}
            >
              <option value=""></option>
              {yearOptions.map(year => (
                <option value={year} key={`start-${year}`}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </div>
        </div>
        <div className="w-100 mb-5">
          <label htmlFor="inputEndMonth">
            <P2 className="mb-2 text-primary-01" bold>
              End Date
            </P2>
          </label>
          <div className="d-flex flex-row justify-content-between">
            <Form.Control
              as="select"
              onChange={e => setEndMonth(e.target.value)}
              value={endMonth}
              placeholder="Month"
              className="height-auto mr-2"
            >
              <option value=""></option>
              {monthOptions.map(month => (
                <option value={month} key={`end-${month}`}>
                  {month}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              as="select"
              onChange={e => setEndYear(e.target.value)}
              value={endYear}
              placeholder="Year"
              className="height-auto ml-2"
            >
              <option value=""></option>
              {yearOptions.map(year => (
                <option value={year} key={`end-${year}`}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </div>
        </div>
        <div className="w-100 mb-5">
          <P2 className="mb-2 text-primary-01" bold text="Link" />
          <TextInput onChange={e => changeAttribute("link", e.target.value)} value={currentJourneyItem.link} />
        </div>
        <div className="w-100 mb-5">
          <P2 className="mb-2 text-primary-01" bold text="Media" />
          <FileInput
            uppy={uppyBanner}
            pretty
            inputName="profiles[]"
            locale={{
              strings: {
                chooseFiles: "Add media"
              }
            }}
          />
          <div className={cx("d-flex", "flex-wrap", mobile ? "justify-content-center" : "justify-content-between")}>
            {currentJourneyItem.images?.map(image => (
              <div className="position-relative" key={`${image.image_url}`}>
                <TalentProfilePicture
                  className="position-relative mt-2"
                  style={{ borderRadius: "24px" }}
                  src={image.image_url}
                  straight
                  height={213}
                  width={272}
                />
                <Button
                  className="position-absolute"
                  style={{ top: "16px", right: "8px" }}
                  type="white-subtle"
                  size="icon"
                  onClick={() => deleteImage(image.image_url)}
                >
                  <Delete color={mode() == "light" ? lightTextPrimary01 : darkTextPrimary01} size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Divider />
      <Modal.Footer className="px-6 py-3 justify-content-between" style={{ borderTop: "none" }}>
        {editType === "Add" && <Button type="primary-outline" text="Back" onClick={goToPreviousStep} />}
        {editType !== "Add" && (
          <Button type="danger-outline" text={`Delete ${currentJourneyItem.category}`} onClick={deleteMilestone} />
        )}
        <div>
          <Button className="mr-2" type="white-ghost" text="Cancel" onClick={hide} />
          <Button type="primary-default" text="Save" onClick={editType === "Add" ? saveMilestone : updateMilestone} />
        </div>
      </Modal.Footer>
    </>
  );
};

const GoalExperience = ({
  mobile,
  changeAttribute,
  currentJourneyItem,
  goToPreviousStep,
  hide,
  saveGoal,
  updateGoal,
  deleteGoal,
  mode,
  editType,
  validationErrors,
  uppyBanner,
  deleteImage,
  hideBackButton
}) => {
  const [dueMonth, setDueMonth] = useState(returnMonth(currentJourneyItem.due_date));
  const [dueYear, setDueYear] = useState(returnYear(currentJourneyItem.due_date));

  const progressOptions = [
    { value: "planned", title: "Planned" },
    { value: "doing", title: "Doing" },
    { value: "accomplished", title: "Accomplished" },
    { value: "abandoned", title: "Abandoned" },
    { value: "paused", title: "Paused" }
  ];

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const yearOptions = (() => {
    const max = new Date().getFullYear() + 20;
    const min = new Date().getFullYear() - 30;

    const years = [];
    for (let i = max; i >= min; i--) {
      years.push(i);
    }
    return years;
  })();

  useEffect(() => {
    if (dueMonth != "" && dueYear != "") {
      changeAttribute("due_date", dayjs(`${dueMonth}-${dueYear}`, "MMMM-YYYY").format("DD-MM-YYYY"));
    } else {
      changeAttribute("due_date", "");
    }
  }, [dueMonth, dueYear]);

  return (
    <>
      <Modal.Header closeButton className="px-5">
        <H5 bold text={`${editType} ${currentJourneyItem.category}`} />
      </Modal.Header>
      <Divider />
      <Modal.Body
        className={cx(
          "d-flex flex-column align-items-center justify-content-between",
          mobile ? "px-4 pt-4 pb-7" : "px-6 pt-5 pb-6"
        )}
        style={{
          maxHeight: mobile ? "" : "700px",
          overflowY: "overlay"
        }}
      >
        <div className="w-100 mb-5">
          <TextInput
            title="Title"
            onChange={e => changeAttribute("title", e.target.value)}
            value={currentJourneyItem.title}
            placeholder="Ex: Finding a co-founder for my startup"
            required={true}
            error={validationErrors?.title}
          />
        </div>
        <div className="w-100 mb-5">
          <label htmlFor="inputProgress">
            <P2 className="mb-2 text-primary-01" bold>
              Career Goal Status
              <span className="ml-1 text-danger">*</span>
            </P2>
          </label>
          <Form.Control
            as="select"
            onChange={e => changeAttribute("progress", e.target.value)}
            value={currentJourneyItem.progress}
            placeholder="Please Select"
            className={cx("height-auto", "mr-2", validationErrors?.progress && "border-danger")}
          >
            <option value=""></option>
            {progressOptions.map(item => (
              <option value={item.value} key={`progress-${item.value}`}>
                {item.title}
              </option>
            ))}
          </Form.Control>
        </div>
        <div className="w-100 mb-5">
          <TextArea
            title="Description"
            onChange={e => changeAttribute("description", e.target.value)}
            value={currentJourneyItem.description}
            rows={3}
          />
        </div>
        <div className="w-100 mb-5">
          <label htmlFor="inputDueMonth">
            <P2 className="mb-2 text-primary-01" bold>
              Due Date <span className="text-danger">*</span>
            </P2>
          </label>
          <div className="d-flex flex-row justify-content-between">
            <Form.Control
              as="select"
              onChange={e => setDueMonth(e.target.value)}
              value={dueMonth}
              placeholder="Month"
              className={cx("height-auto", "mr-2", validationErrors?.dueDate && "border-danger")}
            >
              <option value=""></option>
              {monthOptions.map(month => (
                <option value={month} key={`due-${month}`}>
                  {month}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              as="select"
              onChange={e => setDueYear(e.target.value)}
              value={dueYear}
              placeholder="Year"
              className={cx("height-auto", "ml-2", validationErrors?.dueDate && "border-danger")}
            >
              <option value=""></option>
              {yearOptions.map(year => (
                <option value={year} key={`due-${year}`}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </div>
        </div>
        <div className="w-100 mb-5">
          <P2 className="mb-2 text-primary-01" bold text="Media" />
          <FileInput
            uppy={uppyBanner}
            pretty
            inputName="profiles[]"
            locale={{
              strings: {
                chooseFiles: "Add media"
              }
            }}
          />
          <div className={cx("d-flex", "flex-wrap", mobile ? "justify-content-center" : "justify-content-between")}>
            {currentJourneyItem.images?.map(image => (
              <div className="position-relative" key={`${image.image_url}`}>
                <TalentProfilePicture
                  className="position-relative mt-2"
                  style={{ borderRadius: "24px" }}
                  src={image.image_url}
                  straight
                  height={213}
                  width={272}
                />
                <Button
                  className="position-absolute"
                  style={{ top: "16px", right: "8px" }}
                  type="white-subtle"
                  size="icon"
                  onClick={() => deleteImage(image.image_url)}
                >
                  <Delete color={mode() == "light" ? lightTextPrimary01 : darkTextPrimary01} size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Divider />
      <Modal.Footer className="px-6 py-3 justify-content-between" style={{ borderTop: "none" }}>
        {editType === "Add" && !hideBackButton && (
          <Button type="primary-outline" text="Back" onClick={goToPreviousStep} />
        )}
        {editType !== "Add" && (
          <Button type="danger-outline" text={`Delete ${currentJourneyItem.category}`} onClick={deleteGoal} />
        )}
        <div style={{ marginLeft: editType === "Add" && hideBackButton ? "auto" : 0 }}>
          <Button className="mr-2" type="white-ghost" text="Cancel" onClick={hide} />
          <Button type="primary-default" text="Save" onClick={editType === "Add" ? saveGoal : updateGoal} />
        </div>
      </Modal.Footer>
    </>
  );
};

const EditJourneyModal = ({
  show,
  hide,
  talent,
  setTalent,
  editType,
  setJourneyItem,
  journeyItem = {},
  skipToNextStepItemName,
  hideBackButton = false,
  username
}) => {
  const { profile, fetchProfile } = useProfileFetcher();
  useEffect(() => {
    if (!!talent || !!profile) return;
    fetchProfile(username);
  }, [username, profile]);
  const tempTalent = talent || profile;
  const { mobile } = useWindowDimensionsHook();
  const { mode } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentJourneyItem, setCurrentJourneyItem] = useState({
    id: journeyItem?.id || "",
    title: journeyItem?.title || "",
    start_date: journeyItem?.start_date ? dayjs(journeyItem.start_date, "YYYY-MM-DD").format("YYYY-MM") : "",
    end_date: journeyItem?.end_date ? dayjs(journeyItem.end_date, "YYYY-MM-DD").format("YYYY-MM") : "",
    due_date: journeyItem?.due_date ? dayjs(journeyItem.due_date, "YYYY-MM-DD").format("YYYY-MM") : "",
    description: journeyItem?.description || "",
    link: journeyItem?.link || "",
    institution: journeyItem?.institution || "",
    in_progress: journeyItem?.in_progress || false,
    progress: journeyItem?.progress || "",
    category: journeyItem?.category || "",
    images: journeyItem?.images || []
  });

  const [validationErrors, setValidationErrors] = useState({
    title: false,
    startDate: false,
    dueDate: false,
    progress: false,
    description: false,
    institution: false,
    status: false
  });

  const milestoneErrors = () => {
    const errors = {};
    if (currentJourneyItem.title == "") {
      errors.title = true;
    }
    if (currentJourneyItem.start_date == "") {
      errors.startDate = true;
    }
    if (currentJourneyItem.description == "") {
      errors.description = true;
    }
    if (currentJourneyItem.institution == "") {
      errors.institution = true;
    }

    return errors;
  };

  const goalErrors = () => {
    const errors = {};
    if (currentJourneyItem.title == "") {
      errors.title = true;
    }
    if (currentJourneyItem.due_date == "") {
      errors.dueDate = true;
    }
    if (currentJourneyItem.progress == "") {
      errors.progress = true;
    }

    return errors;
  };

  const uppyBanner = new Uppy({
    meta: { type: "avatar" },
    restrictions: {
      maxFileSize: 5120000,
      allowedFileTypes: [".jpg", ".png", ".jpeg", ".gif"],
      maxNumberOfFiles: 10
    },
    autoProceed: true
  });

  uppyBanner.use(AwsS3Multipart, {
    limit: 4,
    companionUrl: "/",
    companionHeaders: {
      "X-CSRF-Token": getAuthToken()
    }
  });

  const saveMilestone = async () => {
    const errors = milestoneErrors();

    if (Object.keys(errors).length > 0) {
      return setValidationErrors(errors);
    }

    const response = await post(`/api/v1/talent/${tempTalent.id}/milestones`, {
      milestone: {
        ...currentJourneyItem
      }
    });

    if (response && !response.error) {
      // setTalent(prev => ({
      //   ...prev,
      //   milestones: [...prev.milestones, response]
      // }));

      toast.success(<ToastBody heading="Success!" body={"Milestone created successfully."} mode={mode} />, {
        autoClose: 1500
      });
      exitModal();
      setTalent();
    } else {
      toast.error(<ToastBody heading="Error!" body={response?.error} mode={mode} />, { autoClose: 5000 });
    }
  };

  const updateMilestone = async () => {
    const errors = milestoneErrors();

    if (Object.keys(errors).length > 0) {
      return setValidationErrors(errors);
    }

    const response = await patch(`/api/v1/talent/${tempTalent.id}/milestones/${currentJourneyItem.id}`, {
      milestone: currentJourneyItem
    });

    if (response && !response.error) {
      // const newMilestones = talent.milestones.map(milestone => {
      //   if (milestone.id === response.id) {
      //     return { ...response };
      //   }
      //   return { ...milestone };
      // });

      // setTalent(prev => ({
      //   ...prev,
      //   milestones: newMilestones
      // }));

      toast.success(<ToastBody heading="Success!" body={"Milestone updated successfully."} mode={mode} />, {
        autoClose: 1500
      });
      exitModal();
      setTalent();
    } else {
      toast.error(<ToastBody heading="Error!" body={response?.error} mode={mode} />, { autoClose: 5000 });
    }
  };

  const deleteMilestone = async () => {
    const response = await destroy(`/api/v1/talent/${tempTalent.id}/milestones/${currentJourneyItem.id}`);

    if (response) {
      // const index = talent.milestones.findIndex(milestone => milestone.id === response.id);
      // const newMilestones = [...talent.milestones.slice(0, index), ...talent.milestones.slice(index + 1)];

      // setTalent(prev => ({
      //   ...prev,
      //   milestones: newMilestones
      // }));

      toast.success(<ToastBody heading="Success!" body={"Milestone deleted successfully."} mode={mode} />, {
        autoClose: 1500
      });
      setTalent();
    }

    exitModal();
  };

  const saveGoal = async () => {
    const errors = goalErrors();

    if (Object.keys(errors).length > 0) {
      return setValidationErrors(errors);
    }

    const response = await post(`/api/v1/career_goals/${talent.career_goal.id}/goals`, {
      goal: currentJourneyItem
    });

    if (response && !response.error) {
      setTalent(prev => ({
        ...prev,
        career_goal: {
          ...prev.career_goal,
          goals: [...prev.career_goal.goals, response]
        }
      }));

      toast.success(<ToastBody heading="Success!" body={"Goal created successfully."} mode={mode} />, {
        autoClose: 1500
      });
    } else {
      toast.error(<ToastBody heading="Error!" body={response?.error} mode={mode} />);
    }

    exitModal();
  };

  const updateGoal = async () => {
    const errors = goalErrors();

    if (Object.keys(errors).length > 0) {
      return setValidationErrors(errors);
    }

    const response = await patch(`/api/v1/career_goals/${talent.career_goal.id}/goals/${currentJourneyItem.id}`, {
      goal: currentJourneyItem
    });

    if (response && !response.error) {
      if (talent.career_goal.goals?.length > 0) {
        const newGoals = talent.career_goal.goals.map(goal => {
          if (goal.id === response.id) {
            return { ...response };
          }
          return { ...goal };
        });

        setTalent(prev => ({
          ...prev,
          career_goal: {
            ...prev.career_goal,
            goals: newGoals
          }
        }));

        toast.success(<ToastBody heading="Success!" body={"Goal updated successfully."} mode={mode} />, {
          autoClose: 1500
        });
      } else {
        setTalent();
      }
    } else {
      toast.error(<ToastBody heading="Error!" body={response?.error} mode={mode} />);
    }

    exitModal();
  };

  const deleteGoal = async () => {
    const response = await destroy(`/api/v1/career_goals/${talent.career_goal.id}/goals/${currentJourneyItem.id}`);

    if (response) {
      if (talent.career_goal.goals?.length > 0) {
        const index = talent.career_goal.goals.findIndex(goal => goal.id === response.id);
        const newGoals = [...talent.career_goal.goals.slice(0, index), ...talent.career_goal.goals.slice(index + 1)];

        setTalent(prev => ({
          ...prev,
          career_goal: {
            ...prev.career_goal,
            goals: newGoals
          }
        }));

        toast.success(<ToastBody heading="Success!" body={"Goal deleted successfully."} mode={mode} />, {
          autoClose: 1500
        });
      } else {
        setTalent();
      }
    }

    exitModal();
  };

  const deleteImage = imageUrl => {
    const index = currentJourneyItem.images.findIndex(image => image.image_url === imageUrl);

    const newImages = [...currentJourneyItem.images.slice(0, index), ...currentJourneyItem.images.slice(index + 1)];

    setCurrentJourneyItem(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const goToNextStep = newExperienceType => {
    setCurrentJourneyItem(prev => ({ ...prev, category: newExperienceType }));
    setCurrentStep(2);
  };

  const goToPreviousStep = () => {
    setCurrentJourneyItem({
      id: "",
      title: "",
      startDate: "",
      endDate: "",
      dueDate: "",
      description: "",
      link: "",
      institution: "",
      inProgress: false,
      category: "",
      images: []
    });
    setCurrentStep(1);
  };

  const changeAttribute = (attribute, value) => {
    setValidationErrors(prev => ({ ...prev, [attribute]: false }));
    setCurrentJourneyItem(prev => ({ ...prev, [attribute]: value }));
  };

  const exitModal = () => {
    setCurrentJourneyItem({
      id: "",
      title: "",
      start_date: "",
      end_date: "",
      due_date: "",
      description: "",
      link: "",
      institution: "",
      in_progress: false,
      progress: "",
      category: ""
    });
    setJourneyItem(null);
    setCurrentStep(1);
    hide();
  };

  useEffect(() => {
    if (!skipToNextStepItemName) return;
    goToNextStep(skipToNextStepItemName);
  }, []);

  useEffect(() => {
    uppyBanner.on("restriction-failed", () => {
      uppyBanner.reset();
    });
    uppyBanner.on("upload-success", (file, response) => {
      setCurrentJourneyItem(prev => ({
        ...prev,
        images: [
          ...prev.images,
          {
            image_url: response.uploadURL,
            image_data: {
              // eslint-disable-next-line no-useless-escape
              id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
              storage: "cache",
              metadata: {
                size: file.size,
                filename: file.name,
                mime_type: file.type
              }
            }
          }
        ]
      }));
    });
    uppyBanner.on("upload", () => {});
  }, [uppyBanner]);

  const debouncedSaveMilestone = debounce(() => saveMilestone(), 400);
  const debouncedUpdateMilestone = debounce(() => updateMilestone(), 400);
  const debouncedDeleteMilestone = debounce(() => deleteMilestone(), 400);
  const debouncedSaveGoal = debounce(() => saveGoal(), 400);
  const debouncedUpdateGoal = debounce(() => updateGoal(), 400);
  const debouncedDeleteGoal = debounce(() => deleteGoal(), 400);

  return (
    <Modal
      scrollable={true}
      show={show}
      onHide={exitModal}
      centered
      dialogClassName={mobile ? "mw-100 mh-100 m-0" : "remove-background"}
      contentClassName={mobile ? "h-100" : ""}
      fullscreen="true"
      className="edit-modal"
    >
      {editType === "Add" ? (
        <>
          {currentStep === 1 && <SelectExperienceType mobile={mobile} goToNextStep={goToNextStep} />}
          {currentStep === 2 && currentJourneyItem.category !== "Career Goal" && (
            <MilestoneExperience
              mobile={mobile}
              changeAttribute={changeAttribute}
              currentJourneyItem={currentJourneyItem}
              goToPreviousStep={goToPreviousStep}
              hide={exitModal}
              saveMilestone={debouncedSaveMilestone}
              mode={mode}
              editType={editType}
              validationErrors={validationErrors}
              uppyBanner={uppyBanner}
              deleteImage={deleteImage}
              hideBackButton={hideBackButton}
            />
          )}
          {currentStep === 2 && currentJourneyItem.category === "Career Goal" && (
            <GoalExperience
              mobile={mobile}
              changeAttribute={changeAttribute}
              currentJourneyItem={currentJourneyItem}
              goToPreviousStep={goToPreviousStep}
              hide={exitModal}
              saveGoal={debouncedSaveGoal}
              mode={mode}
              editType={editType}
              validationErrors={validationErrors}
              uppyBanner={uppyBanner}
              deleteImage={deleteImage}
              hideBackButton={hideBackButton}
            />
          )}
        </>
      ) : (
        <>
          {currentJourneyItem.category !== "Career Goal" ? (
            <MilestoneExperience
              mobile={mobile}
              changeAttribute={changeAttribute}
              currentJourneyItem={currentJourneyItem}
              goToPreviousStep={goToPreviousStep}
              hide={exitModal}
              saveMilestone={debouncedSaveMilestone}
              updateMilestone={debouncedUpdateMilestone}
              deleteMilestone={debouncedDeleteMilestone}
              mode={mode}
              editType={editType}
              validationErrors={validationErrors}
              uppyBanner={uppyBanner}
              deleteImage={deleteImage}
              hideBackButton={hideBackButton}
            />
          ) : (
            <GoalExperience
              mobile={mobile}
              changeAttribute={changeAttribute}
              currentJourneyItem={currentJourneyItem}
              goToPreviousStep={goToPreviousStep}
              hide={exitModal}
              saveGoal={debouncedSaveGoal}
              updateGoal={debouncedUpdateGoal}
              deleteGoal={debouncedDeleteGoal}
              mode={mode}
              editType={editType}
              validationErrors={validationErrors}
              uppyBanner={uppyBanner}
              deleteImage={deleteImage}
              hideBackButton={hideBackButton}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default EditJourneyModal;
