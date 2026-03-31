import React, { useEffect, useRef, useState } from "react";
import "./ResearchEvalForm.css";
import { lookupAPI } from "../../services/api";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_CAMPUSES = [
  { value: "1", label: "Main Campus" },
  { value: "2", label: "North Campus" },
  { value: "3", label: "South Campus" },
];
const MOCK_SCHOOL_YEARS = [
  { value: "1", label: "2022–2023" },
  { value: "2", label: "2023–2024" },
  { value: "3", label: "2024–2025" },
  { value: "4", label: "2025–2026" },
];
const MOCK_SEMESTERS = [
  { value: "1", label: "1st Semester" },
  { value: "2", label: "2nd Semester" },
  { value: "3", label: "Summer" },
];
const MOCK_COLLEGES = [
  { value: "1", label: "College of Engineering" },
  { value: "2", label: "College of Science" },
  { value: "3", label: "College of Arts & Humanities" },
  { value: "4", label: "College of Business Administration" },
  { value: "5", label: "College of Education" },
];
const MOCK_DEPARTMENTS = {
  "1": [
    { value: "101", label: "Computer Engineering" },
    { value: "102", label: "Civil Engineering" },
    { value: "103", label: "Electrical Engineering" },
    { value: "104", label: "Mechanical Engineering" },
  ],
  "2": [
    { value: "201", label: "Biology" },
    { value: "202", label: "Chemistry" },
    { value: "203", label: "Physics" },
    { value: "204", label: "Mathematics" },
  ],
  "3": [
    { value: "301", label: "Communication Arts" },
    { value: "302", label: "English Language Studies" },
    { value: "303", label: "Filipino Studies" },
  ],
  "4": [
    { value: "401", label: "Business Management" },
    { value: "402", label: "Accountancy" },
    { value: "403", label: "Marketing Management" },
  ],
  "5": [
    { value: "501", label: "Elementary Education" },
    { value: "502", label: "Secondary Education" },
    { value: "503", label: "Special Education" },
  ],
};

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCEPTED = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png";

const REFERENCES = {
  authorship_form: {
    url: "https://docs.google.com/document/d/1uWv9hi7OQvMKSnCm1xSE49EErp-XilQ9LY3TcObuIb8/edit",
  },
  evaluation_form: {
    url: "https://drive.google.com/file/d/1aR5LN-rDMRFgVKqfucWjOEmZw1jCesVN/view",
  },
};

const FILE_FIELDS = [
  "authorship_form",
  "evaluation_form",
  "full_paper",
  "turnitin_report",
  "grammarly_report",
  "journal_conference_info",
];

const FILE_LABELS = {
  authorship_form:         "Authorship Form",
  evaluation_form:         "Evaluation Form",
  full_paper:              "Full Paper",
  turnitin_report:         "Turnitin Report",
  grammarly_report:        "Grammarly Report",
  journal_conference_info: "Journal / Conference Info",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 6;
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function toOptions(items) {
  return (items || []).map((item) => ({
    value: String(item.id ?? item.value ?? item),
    label: item.name ?? item.label ?? String(item),
  }));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Lbl({ t, req }) {
  return (
    <label className="ref-label">
      {t}
      {req && <span className="ref-label-req"> *</span>}
    </label>
  );
}

function Field({ label, req, children }) {
  return (
    <div className="ref-field">
      <Lbl t={label} req={req} />
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder, disabled, loading }) {
  if (loading) return <div className="ref-skeleton" />;
  return (
    <div className="ref-select-wrap">
      <select
        className="ref-select"
        value={value}
        onChange={onChange}
        disabled={disabled || !options.length}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="ref-select-arrow">▾</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="ref-section">
      <div className="ref-section-title">{title}</div>
      <div className="ref-section-body">{children}</div>
    </div>
  );
}

// ── Author Tag Input ──────────────────────────────────────────────────────────

function AuthorInput({ authors, onAuthorsChange }) {
  const [input, setInput] = useState("");

  const add = () => {
    const t = input.trim();
    if (!t) return;
    onAuthorsChange([...authors, t]);
    setInput("");
  };

  const remove = (idx) =>
    onAuthorsChange(authors.filter((_, i) => i !== idx));

  return (
    <div>
      {authors.length > 0 && (
        <div className="ref-author-tags">
          {authors.map((a, i) => (
            <span key={i} className="ref-author-tag">
              {a}
              <button
                type="button"
                className="ref-author-tag-remove"
                onClick={() => remove(i)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="ref-author-row">
        <input
          className="ref-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Type author name and press Enter…"
        />
        <button type="button" className="ref-author-add" onClick={add}>
          Add
        </button>
      </div>
      <div className="ref-hint">Press Enter or click Add for each author.</div>
    </div>
  );
}

// ── File Upload Field ─────────────────────────────────────────────────────────

function FileUploadField({ label, fieldKey, file, onFileChange, referenceUrl }) {
  const inputRef = useRef(null);
  const hasFile = Boolean(file);

  return (
    <div className="ref-field">
      <div className="ref-file-header">
        <Lbl t={label} req />
        {referenceUrl && (
          <a
            href={referenceUrl}
            target="_blank"
            rel="noreferrer"
            className="ref-file-template-link"
          >
            📄 View Template
          </a>
        )}
      </div>

      {/* Hidden real file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        style={{ display: "none" }}
        onChange={(e) => onFileChange(fieldKey, e.target.files[0] || null)}
      />

      {/* Visible styled label — clicks the hidden input */}
      <div
        className={`ref-file-label${hasFile ? " has-file" : ""}`}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        <span className={`ref-file-icon${hasFile ? " has-file" : ""}`}>
          {hasFile ? "✅" : "📁"}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {hasFile ? (
            <>
              <div className="ref-file-info-name">{file.name}</div>
              <div className="ref-file-info-meta">
                {(file.size / 1024).toFixed(1)} KB · Click to replace
              </div>
            </>
          ) : (
            <>
              <div className="ref-file-info-placeholder">Click to upload file</div>
              <div className="ref-file-info-meta">
                PDF, Word, Excel, PowerPoint, or Image
              </div>
            </>
          )}
        </div>
        {hasFile && (
          <span className="ref-file-uploaded-badge">Uploaded ✓</span>
        )}
      </div>

      {hasFile && (
        <button
          type="button"
          className="ref-file-remove"
          onClick={() => {
            onFileChange(fieldKey, null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          ✕ Remove file
        </button>
      )}
    </div>
  );
}

// ── Schedule Preview Badge ────────────────────────────────────────────────────

function ScheduleBadge({ date, time }) {
  if (!date && !time) return null;

  const formattedDate = date
    ? (() => {
        const [y, m, d] = date.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString("en-PH", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      })()
    : null;

  const formattedTime = time
    ? new Date(`1970-01-01T${time}`).toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className="ref-schedule-badge">
      <span style={{ fontSize: 22 }}>🗓️</span>
      <div>
        <div className="ref-schedule-badge-eyebrow">Scheduled Appointment</div>
        <div className="ref-schedule-badge-value">
          {formattedDate || "—"}
          {formattedTime ? ` · ${formattedTime}` : ""}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const ResearchEvalForm = ({ onNavigate }) => {
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // Keep authors as an array for cleaner tag management
  const [authors, setAuthors] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState({
    authorship_form: null,
    evaluation_form: null,
    full_paper: null,
    turnitin_report: null,
    grammarly_report: null,
    journal_conference_info: null,
  });

  const [form, setForm] = useState({
    campus_id: "",
    college_id: "",
    department_id: "",
    school_year_id: "",
    semester_id: "",
    title_of_research: "",
    appointment_date: "",
    appointment_time: "",
  });

  // ── Dropdown state ──
  const [campuses,    setCampuses]    = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [semesters,   setSemesters]   = useState([]);
  const [colleges,    setColleges]    = useState([]);
  const [departments, setDepartments] = useState([]);

  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [collegesLoading,  setCollegesLoading]  = useState(false);
  const [deptsLoading,     setDeptsLoading]     = useState(false);
  const [submitting,       setSubmitting]       = useState(false);
  const [status,           setStatus]           = useState({ type: "", msg: "" });
  const [dropdownError,    setDropdownError]    = useState("");

  const weekendError = isWeekend(form.appointment_date);

  // ── Load dropdowns from backend ──────────────────────────────────────────
  useEffect(() => {
    const loadInitialLookups = async () => {
      try {
        setDropdownsLoading(true);
        setDropdownError("");

        const [campusesData, schoolYearsData, semestersData] = await Promise.all([
          lookupAPI.getCampuses(),
          lookupAPI.getSchoolYears(),
          lookupAPI.getSemesters(),
        ]);

        setCampuses(toOptions(campusesData));
        setSchoolYears(toOptions(schoolYearsData));
        setSemesters(toOptions(semestersData));
      } catch (error) {
        console.error("Failed to load research evaluation dropdowns:", error);
        setCampuses([]);
        setSchoolYears([]);
        setSemesters([]);
        setDropdownError("Failed to load dropdown data from the database. Please check backend connection.");
      } finally {
        setDropdownsLoading(false);
      }
    };

    loadInitialLookups();
  }, []);

  const handleCampusChange = async (campusId) => {
    set("campus_id", campusId);
    set("college_id", "");
    set("department_id", "");
    setColleges([]);
    setDepartments([]);

    if (!campusId) return;

    try {
      setCollegesLoading(true);
      const collegesData = await lookupAPI.getCollegesByCampus(campusId);
      setColleges(toOptions(collegesData));
    } catch (error) {
      console.error("Failed to load colleges for campus:", error);
      setColleges([]);
      setDropdownError("Failed to load colleges from the database.");
    } finally {
      setCollegesLoading(false);
    }
  };

  const handleCollegeChange = async (collegeId) => {
    set("college_id", collegeId);
    set("department_id", "");
    setDepartments([]);

    if (!collegeId) return;

    try {
      setDeptsLoading(true);
      const departmentsData = await lookupAPI.getDepartmentsByCollege(collegeId);
      setDepartments(toOptions(departmentsData));
    } catch (error) {
      console.error("Failed to load departments for college:", error);
      setDepartments([]);
      setDropdownError("Failed to load departments from the database.");
    } finally {
      setDeptsLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const set     = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const on      = (k)    => (e) => set(k, e.target.value);
  const setFile = (k, v) => setSelectedFiles((f) => ({ ...f, [k]: v }));

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (authors.length === 0) {
      setStatus({ type: "error", msg: '"Author(s)" is required.' });
      return false;
    }
    const requiredFields = [
      ["campus_id",         "Campus"],
      ["college_id",        "College"],
      ["department_id",     "Department"],
      ["school_year_id",    "School Year"],
      ["semester_id",       "Semester"],
      ["title_of_research", "Title of Research"],
    ];
    for (const [k, lbl] of requiredFields) {
      if (!form[k]) {
        setStatus({ type: "error", msg: `"${lbl}" is required.` });
        return false;
      }
    }
    if (!form.appointment_date) {
      setStatus({ type: "error", msg: '"Appointment Date" is required.' });
      return false;
    }
    if (isWeekend(form.appointment_date)) {
      setStatus({
        type: "error",
        msg: "Appointments cannot be scheduled on weekends. Please choose a weekday.",
      });
      return false;
    }
    if (!form.appointment_time) {
      setStatus({ type: "error", msg: '"Appointment Time" is required.' });
      return false;
    }
    for (const k of FILE_FIELDS) {
      if (!selectedFiles[k]) {
        setStatus({ type: "error", msg: `"${FILE_LABELS[k]}" file is required.` });
        return false;
      }
    }
    return true;
  };

  // ── Submit (mocked) ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setStatus({ type: "", msg: "" });
    try {
      await sleep(1400);
      setStatus({ type: "success", msg: "✅ Application submitted successfully! (Demo mode)" });
      setTimeout(() => onNavigate?.("home"), 2000);
    } catch {
      setStatus({ type: "error", msg: "Submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="ref-root">

      {/* ── Page Header ── */}
      <div className="ref-header">
        <div>
          <div className="ref-header-eyebrow">Research Evaluation</div>
          <h1>Application For Research Evaluation</h1>
        </div>
        <button className="ref-header-action" onClick={() => onNavigate?.("home")}>
          ← Return
        </button>
      </div>

      {/* ── Body ── */}
      <div className="ref-body">

        <div className="ref-tip">
          💡 For Authorship Form and Evaluation Form, click{" "}
          <strong style={{ marginLeft: 3 }}>&quot;View Template&quot;</strong> to download,
          fill out, then upload the completed file.
        </div>

        {dropdownError && (
          <div className="ref-tip" style={{ background: "#fff1f1", borderColor: "#f0b7b7", color: "#8b2d2d" }}>
            ⚠ {dropdownError}
          </div>
        )}

        {/* ── Section 1: Research Information ── */}
        <Section title="Research Information">
          <Field label="Title of Research" req>
            <input
              className="ref-input"
              type="text"
              value={form.title_of_research}
              onChange={on("title_of_research")}
              placeholder="Enter the complete title of research…"
            />
          </Field>
          <div className="ref-row-2">
            <Field label="School Year" req>
              <SelectField
                value={form.school_year_id}
                onChange={on("school_year_id")}
                options={schoolYears}
                placeholder="Select school year"
                loading={dropdownsLoading}
              />
            </Field>
            <Field label="Semester" req>
              <SelectField
                value={form.semester_id}
                onChange={on("semester_id")}
                options={semesters}
                placeholder="Select semester"
                loading={dropdownsLoading}
              />
            </Field>
          </div>
        </Section>

        {/* ── Section 2: Author & Academic Unit ── */}
        <Section title="Author(s) & Academic Unit">
          <Field label="Author(s)" req>
            <AuthorInput
              authors={authors}
              onAuthorsChange={setAuthors}
            />
          </Field>
          <div className="ref-row-3">
            <Field label="Campus" req>
              <SelectField
                value={form.campus_id}
                onChange={(e) => handleCampusChange(e.target.value)}
                options={campuses}
                placeholder="Select campus"
                loading={dropdownsLoading}
              />
            </Field>
            <Field label="College" req>
              <SelectField
                value={form.college_id}
                onChange={(e) => handleCollegeChange(e.target.value)}
                options={colleges}
                placeholder={form.campus_id ? "Select college" : "Select campus first"}
                disabled={!form.campus_id}
                loading={collegesLoading}
              />
            </Field>
            <Field label="Department / Program" req>
              <SelectField
                value={form.department_id}
                onChange={on("department_id")}
                options={departments}
                placeholder={
                  form.college_id ? "Select department" : "Select college first"
                }
                disabled={!form.college_id}
                loading={deptsLoading}
              />
            </Field>
          </div>
        </Section>

        {/* ── Section 3: Evaluation Schedule ── */}
        <Section title="Evaluation Schedule">
          <div className="ref-weekend-tip">
            📅{" "}
            <span>
              Select your preferred date and time for the evaluation appointment.{" "}
              <strong>Weekends are not available.</strong>
            </span>
          </div>
          <div className="ref-row-2">
            <Field label="Appointment Date" req>
              <div className="ref-date-wrap">
                <input
                  ref={dateInputRef}
                  type="date"
                  className={`ref-input${weekendError ? " ref-input-error" : ""}`}
                  value={form.appointment_date}
                  min={todayStr()}
                  onChange={(e) => set("appointment_date", e.target.value)}
                  style={{ paddingRight: 36 }}
                />
                <span
                  className="ref-date-icon"
                  onClick={() => dateInputRef.current?.showPicker?.()}
                >
                  📅
                </span>
              </div>
              {weekendError && (
                <div className="ref-date-error">
                  ⚠️ Weekends are not available. Please choose a weekday (Mon–Fri).
                </div>
              )}
            </Field>

            <Field label="Appointment Time" req>
              <div className="ref-date-wrap">
                <input
                  ref={timeInputRef}
                  type="time"
                  className="ref-input"
                  value={form.appointment_time}
                  onChange={(e) => set("appointment_time", e.target.value)}
                  style={{ paddingRight: 36 }}
                />
                <span
                  className="ref-date-icon"
                  onClick={() => timeInputRef.current?.showPicker?.()}
                >
                  🕒
                </span>
              </div>
              <div className="ref-hint">
                Use your preferred time for the evaluation appointment.
              </div>
            </Field>
          </div>

          {!weekendError && (
            <ScheduleBadge
              date={form.appointment_date}
              time={form.appointment_time}
            />
          )}
        </Section>

        {/* ── Section 4: Document Uploads ── */}
        <Section title="Document Uploads">
          <div className="ref-row-2">
            <FileUploadField
              label="Authorship Form"
              fieldKey="authorship_form"
              file={selectedFiles.authorship_form}
              onFileChange={setFile}
              referenceUrl={REFERENCES.authorship_form.url}
            />
            <FileUploadField
              label="Evaluation Form"
              fieldKey="evaluation_form"
              file={selectedFiles.evaluation_form}
              onFileChange={setFile}
              referenceUrl={REFERENCES.evaluation_form.url}
            />
          </div>
          <div className="ref-row-2">
            <FileUploadField
              label="Full Paper"
              fieldKey="full_paper"
              file={selectedFiles.full_paper}
              onFileChange={setFile}
            />
            <FileUploadField
              label="Turnitin Report"
              fieldKey="turnitin_report"
              file={selectedFiles.turnitin_report}
              onFileChange={setFile}
            />
          </div>
          <div className="ref-row-2">
            <FileUploadField
              label="Grammarly Report"
              fieldKey="grammarly_report"
              file={selectedFiles.grammarly_report}
              onFileChange={setFile}
            />
            <FileUploadField
              label="Journal / Conference Info"
              fieldKey="journal_conference_info"
              file={selectedFiles.journal_conference_info}
              onFileChange={setFile}
            />
          </div>
        </Section>

        {/* ── Submit ── */}
        <div className="ref-submit-row">
          <button
            type="button"
            className="ref-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
          {status.msg && (
            <div className={`ref-status ${status.type}`}>{status.msg}</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResearchEvalForm;
