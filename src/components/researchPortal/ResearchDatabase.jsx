import React, { useEffect, useRef, useState } from "react";
import "./ResearchDatabase.css";
import { lookupAPI } from "../../services/api";

// ── Mock Data ─────────────────────────────────────────────────────────────────

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
const MOCK_OUTPUT_TYPES = [
  { value: "Local Presentation",         label: "Local Presentation" },
  { value: "International Presentation", label: "International Presentation" },
  { value: "Local Publication",          label: "Local Publication" },
  { value: "International Publication",  label: "International Publication" },
];
const MOCK_RESEARCH_TYPES = [
  { value: "1", label: "Basic Research" },
  { value: "2", label: "Applied Research" },
  { value: "3", label: "Action Research" },
  { value: "4", label: "Development Research" },
  { value: "5", label: "Evaluation Research" },
];
const MOCK_INDEXINGS = [
  { value: "1", label: "Scopus" },
  { value: "2", label: "ISI / Web of Science" },
  { value: "3", label: "DOAJ" },
  { value: "4", label: "PubMed" },
  { value: "5", label: "Google Scholar" },
  { value: "6", label: "EBSCO" },
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

const EMPTY_FORM = {
  school_year_id: "", semester_id: "", research_output_type_id: "",
  research_title: "", research_type_id: "", authors_id: "",
  college_id: "", program_department_id: "",
  appointment_date: "", appointment_time: "",
  presentation_venue: "", conference_name: "",
  presentation_abstract: "", presentation_keywords: "",
  doi: "", manuscript_link: "", journal_publisher: "",
  volume: "", issue_number: "", page_number: "",
  publication_date: "", indexing_id: "", cite_score: "",
  impact_factor: "", journal_website: "", apa_format: "",
  publication_abstract: "", publication_keywords: "",
};

const EMPTY_FILES = {
  editorial_board: null,
  certificate_of_presentation: null,
  call_for_papers: null,
};

const REQUIRED = [
  ["school_year_id",          "School Year"],
  ["semester_id",             "Semester"],
  ["research_output_type_id", "Research Output Type"],
  ["research_title",          "Research Title"],
  ["research_type_id",        "Research Type"],
  ["authors_id",              "Authors"],
  ["college_id",              "College"],
  ["program_department_id",   "Program / Department"],
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  return [0, 6].includes(new Date(y, m - 1, d).getDay());
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

// ── Shared UI Primitives ──────────────────────────────────────────────────────

function Lbl({ text, req }) {
  return (
    <label className="rdb-label">
      {text}
      {req && <span className="rdb-label-req"> *</span>}
    </label>
  );
}

function Field({ children }) {
  return <div className="rdb-field">{children}</div>;
}

function SelectField({ value, onChange, options, placeholder, disabled, loading }) {
  if (loading) return <div className="rdb-skeleton" />;
  return (
    <div className="rdb-select-wrap">
      <select
        className="rdb-select"
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
      <span className="rdb-select-arrow">▾</span>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rdb-card">
      <div className="rdb-card-title">{title}</div>
      <div className="rdb-card-body">{children}</div>
    </div>
  );
}

// ── Inline Calendar ───────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function InlineCalendar({ value, onChange, disableWeekends = false }) {
  const parseLocal = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const selected = parseLocal(value);
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(selected?.getFullYear()  ?? now.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth()     ?? now.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleDay = (day) => {
    const dow = new Date(viewYear, viewMonth, day).getDay();
    if (disableWeekends && (dow === 0 || dow === 6)) return;
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(iso);
  };

  const today = new Date();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rdb-cal">
      <div className="rdb-cal-header">
        <button type="button" className="rdb-cal-nav" onClick={prevMonth}>‹</button>
        <span className="rdb-cal-month">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button type="button" className="rdb-cal-nav" onClick={nextMonth}>›</button>
      </div>

      <div className="rdb-cal-days-header">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`rdb-cal-day-name${
              disableWeekends && (i === 0 || i === 6) ? " weekend" : ""
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="rdb-cal-grid">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} className="rdb-cal-cell empty" />;

          const dow        = new Date(viewYear, viewMonth, day).getDay();
          const isDisabled = disableWeekends && (dow === 0 || dow === 6);
          const isSelected =
            selected &&
            selected.getFullYear() === viewYear &&
            selected.getMonth()    === viewMonth &&
            selected.getDate()     === day;
          const isToday =
            today.getFullYear() === viewYear &&
            today.getMonth()    === viewMonth &&
            today.getDate()     === day;

          let cls = "rdb-cal-cell";
          if (isDisabled)      cls += " disabled";
          else if (isSelected) cls += " selected";
          else if (isToday)    cls += " today";
          else                 cls += " normal";

          return (
            <div
              key={day}
              className={cls}
              onClick={() => handleDay(day)}
              title={isDisabled ? "Weekends unavailable" : ""}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="rdb-cal-legend">
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span className="rdb-cal-legend-dot" style={{ background: "#F5C400" }} /> Selected
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span className="rdb-cal-legend-dot" style={{ border: "1.5px solid #F5C400" }} /> Today
        </span>
        {disableWeekends && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span className="rdb-cal-legend-dot" style={{ background: "#eee" }} /> Unavailable
          </span>
        )}
      </div>
    </div>
  );
}

// ── Schedule Badge ────────────────────────────────────────────────────────────

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
    <div className="rdb-schedule-badge">
      <span style={{ fontSize: 22 }}>🗓️</span>
      <div>
        <div className="rdb-schedule-eyebrow">Scheduled Appointment</div>
        <div className="rdb-schedule-value">
          {formattedDate || "—"}
          {formattedTime ? ` · ${formattedTime}` : ""}
        </div>
      </div>
    </div>
  );
}

// ── File Upload Field ─────────────────────────────────────────────────────────

function FileUploadField({ label, fieldKey, file, onFileChange, req }) {
  const inputRef = useRef(null);
  const hasFile = Boolean(file);

  return (
    <div className="rdb-field">
      <Lbl text={label} req={req} />
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        style={{ display: "none" }}
        onChange={(e) => onFileChange(fieldKey, e.target.files[0] || null)}
      />
      <div
        className={`rdb-file-label${hasFile ? " has-file" : ""}`}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        <span className={`rdb-file-icon${hasFile ? " has-file" : ""}`}>
          {hasFile ? "✅" : "📁"}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {hasFile ? (
            <>
              <div className="rdb-file-name">{file.name}</div>
              <div className="rdb-file-meta">
                {(file.size / 1024).toFixed(1)} KB · Click to replace
              </div>
            </>
          ) : (
            <>
              <div className="rdb-file-placeholder">Click to upload file</div>
              <div className="rdb-file-meta">
                PDF, Word, Excel, PowerPoint, or Image
              </div>
            </>
          )}
        </div>
        {hasFile && <span className="rdb-file-badge">Uploaded ✓</span>}
      </div>
      {hasFile && (
        <button
          type="button"
          className="rdb-file-remove"
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

// ── Main Component ────────────────────────────────────────────────────────────

export default function ResearchDatabase({ onNavigate }) {
  const timeInputRef = useRef(null);

  const [form,  setForm]  = useState(EMPTY_FORM);
  const [files, setFiles] = useState(EMPTY_FILES);

  const [schoolYears,   setSchoolYears]   = useState([]);
  const [semesters,     setSemesters]     = useState([]);
  const [outputTypes,   setOutputTypes]   = useState([]);
  const [researchTypes, setResearchTypes] = useState([]);
  const [indexings,     setIndexings]     = useState([]);
  const [colleges,      setColleges]      = useState([]);
  const [departments,   setDepartments]   = useState([]);

  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [deptsLoading,     setDeptsLoading]     = useState(false);
  const [submitting,       setSubmitting]       = useState(false);
  const [status,           setStatus]           = useState({ type: "", msg: "" });
  const [dropdownError,    setDropdownError]    = useState("");

  const weekendErr = isWeekend(form.appointment_date);
  const showPres   = ["Local Presentation", "International Presentation"].includes(form.research_output_type_id);
  const showPub    = ["Local Publication",  "International Publication"].includes(form.research_output_type_id);

  // ── Load dropdowns from backend + static option sets ────────────────────
  useEffect(() => {
    const loadLookups = async () => {
      try {
        setDropdownsLoading(true);
        setDropdownError("");

        const [schoolYearsData, semestersData, collegesData] = await Promise.all([
          lookupAPI.getSchoolYears(),
          lookupAPI.getSemesters(),
          lookupAPI.getColleges(),
        ]);

        setSchoolYears(toOptions(schoolYearsData));
        setSemesters(toOptions(semestersData));
        setColleges(toOptions(collegesData));
      } catch (error) {
        console.error("Failed to load research database dropdowns:", error);
        setSchoolYears([]);
        setSemesters([]);
        setColleges([]);
        setDropdownError("Failed to load dropdown data from the database. Please check backend connection.");
      } finally {
        setOutputTypes(MOCK_OUTPUT_TYPES);
        setResearchTypes(MOCK_RESEARCH_TYPES);
        setIndexings(MOCK_INDEXINGS);
        setDropdownsLoading(false);
      }
    };

    loadLookups();
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const set     = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const on      = (k)    => (e) => set(k, e.target.value);
  const setFile = (k, v) => setFiles((f) => ({ ...f, [k]: v }));

  const handleOutputTypeChange = (e) => {
    const v = e.target.value;
    setForm((f) => ({
      ...f,
      research_output_type_id: v,
      // Reset conditional fields
      presentation_venue: "", conference_name: "",
      presentation_abstract: "", presentation_keywords: "",
      doi: "", manuscript_link: "", journal_publisher: "",
      volume: "", issue_number: "", page_number: "",
      publication_date: "", indexing_id: "", cite_score: "",
      impact_factor: "", journal_website: "", apa_format: "",
      publication_abstract: "", publication_keywords: "",
    }));
    setFiles(EMPTY_FILES);
  };

  const handleCollegeChange = async (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, college_id: v, program_department_id: "" }));
    setDepartments([]);

    if (!v) return;

    try {
      setDeptsLoading(true);
      const departmentsData = await lookupAPI.getDepartmentsByCollege(v);
      setDepartments(toOptions(departmentsData));
    } catch (error) {
      console.error("Failed to load departments for college:", error);
      setDepartments([]);
      setDropdownError("Failed to load departments from the database.");
    } finally {
      setDeptsLoading(false);
    }
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    for (const [k, lbl] of REQUIRED) {
      if (!form[k]) {
        setStatus({ type: "error", msg: `"${lbl}" is required.` });
        return false;
      }
    }
    if (!form.appointment_date) {
      setStatus({ type: "error", msg: '"Appointment Date" is required.' });
      return false;
    }
    if (weekendErr) {
      setStatus({ type: "error", msg: "Appointments cannot be scheduled on weekends." });
      return false;
    }
    if (!form.appointment_time) {
      setStatus({ type: "error", msg: '"Appointment Time" is required.' });
      return false;
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
      setStatus({ type: "success", msg: "✅ Record submitted successfully! (Demo mode)" });
      setForm(EMPTY_FORM);
      setFiles(EMPTY_FILES);
      setDepartments([]);
      setTimeout(() => onNavigate?.("home"), 2000);
    } catch {
      setStatus({ type: "error", msg: "Submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="rdb-root">

      {/* ── Header ── */}
      <div className="rdb-header">
        <div>
          <div className="rdb-header-eyebrow">Research Database</div>
          <h1>Submit Research Database Record</h1>
        </div>
        <button type="button" className="rdb-header-action" onClick={() => onNavigate?.("home")}>
          ← Return
        </button>
      </div>

      <div className="rdb-body">

        <div className="rdb-tip">
          <span style={{ fontSize: 14 }}>💡</span>
          Fill in all required fields marked with{" "}
          <strong className="rdb-tip-req">*</strong>.
          Accepted file formats: PDF, Word, Excel, PowerPoint, or Image.
        </div>

        {dropdownError && (
          <div className="rdb-tip" style={{ background: "#fff1f1", borderColor: "#f0b7b7", color: "#8b2d2d" }}>
            ⚠ {dropdownError}
          </div>
        )}

        {/* ── 1. Research Information ── */}
        <Card title="Research Information">
          <div className="rdb-row-2">
            <Field>
              <Lbl text="School Year" req />
              <SelectField
                value={form.school_year_id}
                onChange={on("school_year_id")}
                options={schoolYears}
                placeholder="Select school year"
                loading={dropdownsLoading}
              />
            </Field>
            <Field>
              <Lbl text="Semester" req />
              <SelectField
                value={form.semester_id}
                onChange={on("semester_id")}
                options={semesters}
                placeholder="Select semester"
                loading={dropdownsLoading}
              />
            </Field>
          </div>
          <Field>
            <Lbl text="Research Output Type" req />
            <SelectField
              value={form.research_output_type_id}
              onChange={handleOutputTypeChange}
              options={outputTypes}
              placeholder="Select output type"
              loading={dropdownsLoading}
            />
          </Field>
          <Field>
            <Lbl text="Research Title" req />
            <textarea
              className="rdb-textarea"
              value={form.research_title}
              onChange={on("research_title")}
              placeholder="Enter the full research title…"
              rows={3}
            />
          </Field>
        </Card>

        {/* ── 2. Research Type & Authorship ── */}
        <Card title="Research Type & Authorship">
          <Field>
            <Lbl text="Research Type" req />
            <SelectField
              value={form.research_type_id}
              onChange={on("research_type_id")}
              options={researchTypes}
              placeholder="Select research type"
              loading={dropdownsLoading}
            />
          </Field>
          <Field>
            <Lbl text="Authors" req />
            <input
              className="rdb-input"
              type="text"
              value={form.authors_id}
              onChange={on("authors_id")}
              placeholder="e.g. Juan Dela Cruz, Maria Santos"
            />
          </Field>
          <div className="rdb-row-2">
            <Field>
              <Lbl text="College" req />
              <SelectField
                value={form.college_id}
                onChange={handleCollegeChange}
                options={colleges}
                placeholder="Select college"
                loading={dropdownsLoading}
              />
            </Field>
            <Field>
              <Lbl text="Program / Department" req />
              <SelectField
                value={form.program_department_id}
                onChange={on("program_department_id")}
                options={departments}
                placeholder={
                  form.college_id
                    ? "Select program / department"
                    : "Select a college first"
                }
                disabled={!form.college_id}
                loading={deptsLoading}
              />
            </Field>
          </div>
        </Card>

        {/* ── 3. Evaluation Schedule ── */}
        <Card title="Evaluation Schedule">
          <div className="rdb-weekend-tip">
            <span style={{ fontSize: 14 }}>📅</span>
            <span>
              Select your preferred date and time for the evaluation appointment.{" "}
              <strong>Weekends are not available.</strong>
            </span>
          </div>

          <div className="rdb-row-2">
            {/* Left: Calendar */}
            <div>
              <Lbl text="Appointment Date" req />
              <InlineCalendar
                value={form.appointment_date}
                onChange={(v) => set("appointment_date", v)}
                disableWeekends={true}
              />
              {weekendErr && (
                <div className="rdb-date-error">
                  ⚠️ Weekends are not available. Please choose a weekday (Mon–Fri).
                </div>
              )}
            </div>

            {/* Right: Time + badge */}
            <div>
              <Lbl text="Appointment Time" req />
              <div className="rdb-time-wrap">
                <input
                  ref={timeInputRef}
                  type="time"
                  className="rdb-input"
                  value={form.appointment_time}
                  onChange={(e) => set("appointment_time", e.target.value)}
                  style={{ paddingRight: 36 }}
                />
                <span
                  className="rdb-time-icon"
                  onClick={() => timeInputRef.current?.showPicker?.()}
                >
                  🕒
                </span>
              </div>
              <div className="rdb-hint">
                Use your preferred time for the evaluation appointment.
              </div>
              {!weekendErr && (
                <ScheduleBadge
                  date={form.appointment_date}
                  time={form.appointment_time}
                />
              )}
            </div>
          </div>
        </Card>

        {/* ── 4. Presentation Information (conditional) ── */}
        {showPres && (
          <Card title="Presentation Information">
            <div className="rdb-row-2">
              <Field>
                <Lbl text="Presentation Venue" />
                <input
                  className="rdb-input"
                  type="text"
                  value={form.presentation_venue}
                  onChange={on("presentation_venue")}
                  placeholder="e.g. University Auditorium"
                />
              </Field>
              <Field>
                <Lbl text="Conference Name" />
                <input
                  className="rdb-input"
                  type="text"
                  value={form.conference_name}
                  onChange={on("conference_name")}
                  placeholder="e.g. ICCIT 2025"
                />
              </Field>
            </div>
            <Field>
              <Lbl text="Abstract" />
              <textarea
                className="rdb-textarea"
                value={form.presentation_abstract}
                onChange={on("presentation_abstract")}
                placeholder="Enter abstract…"
                rows={4}
              />
            </Field>
            <Field>
              <Lbl text="Keywords" />
              <input
                className="rdb-input"
                type="text"
                value={form.presentation_keywords}
                onChange={on("presentation_keywords")}
                placeholder="e.g. machine learning, NLP"
              />
            </Field>
            <hr className="rdb-divider" />
            <div className="rdb-sub-header">Supporting Documents</div>
            <div className="rdb-row-2">
              <FileUploadField
                label="Certificate of Presentation"
                fieldKey="certificate_of_presentation"
                file={files.certificate_of_presentation}
                onFileChange={setFile}
              />
              <FileUploadField
                label="Call for Papers"
                fieldKey="call_for_papers"
                file={files.call_for_papers}
                onFileChange={setFile}
              />
            </div>
          </Card>
        )}

        {/* ── 5. Publication Information (conditional) ── */}
        {showPub && (
          <Card title="Publication Information">
            <div className="rdb-row-2">
              <Field>
                <Lbl text="DOI" />
                <input
                  className="rdb-input"
                  type="text"
                  value={form.doi}
                  onChange={on("doi")}
                  placeholder="e.g. 10.1016/j.xxx.2025"
                />
              </Field>
              <Field>
                <Lbl text="Manuscript Link" />
                <input
                  className="rdb-input"
                  type="url"
                  value={form.manuscript_link}
                  onChange={on("manuscript_link")}
                  placeholder="https://…"
                />
              </Field>
            </div>
            <Field>
              <Lbl text="Journal / Publisher" />
              <input
                className="rdb-input"
                type="text"
                value={form.journal_publisher}
                onChange={on("journal_publisher")}
                placeholder="e.g. Elsevier, IEEE, Springer"
              />
            </Field>
            <div className="rdb-row-3">
              <Field>
                <Lbl text="Volume" />
                <input
                  className="rdb-input"
                  type="text"
                  value={form.volume}
                  onChange={on("volume")}
                  placeholder="e.g. 12"
                />
              </Field>
              <Field>
                <Lbl text="Issue No." />
                <input
                  className="rdb-input"
                  type="text"
                  value={form.issue_number}
                  onChange={on("issue_number")}
                  placeholder="e.g. 3"
                />
              </Field>
              <Field>
                <Lbl text="Page Number" />
                <input
                  className="rdb-input"
                  type="text"
                  value={form.page_number}
                  onChange={on("page_number")}
                  placeholder="e.g. 45–58"
                />
              </Field>
            </div>
            <div className="rdb-row-2">
              <Field>
                <Lbl text="Publication Date" />
                <input
                  className="rdb-input"
                  type="date"
                  value={form.publication_date}
                  onChange={on("publication_date")}
                />
              </Field>
              <Field>
                <Lbl text="Indexing" />
                <SelectField
                  value={form.indexing_id}
                  onChange={on("indexing_id")}
                  options={indexings}
                  placeholder="Select indexing"
                  loading={dropdownsLoading}
                />
              </Field>
            </div>
            <div className="rdb-row-2">
              <Field>
                <Lbl text="Cite Score" />
                <input
                  className="rdb-input"
                  type="number"
                  step="0.01"
                  value={form.cite_score}
                  onChange={on("cite_score")}
                  placeholder="e.g. 4.20"
                />
              </Field>
              <Field>
                <Lbl text="Impact Factor" />
                <input
                  className="rdb-input"
                  type="number"
                  step="0.01"
                  value={form.impact_factor}
                  onChange={on("impact_factor")}
                  placeholder="e.g. 3.75"
                />
              </Field>
            </div>
            <hr className="rdb-divider" />
            <div className="rdb-sub-header">Additional Publication Info</div>
            <FileUploadField
              label="Editorial Board"
              fieldKey="editorial_board"
              file={files.editorial_board}
              onFileChange={setFile}
            />
            <Field>
              <Lbl text="Journal Website" />
              <input
                className="rdb-input"
                type="url"
                value={form.journal_website}
                onChange={on("journal_website")}
                placeholder="https://…"
              />
            </Field>
            <Field>
              <Lbl text="APA Format Citation" />
              <textarea
                className="rdb-textarea"
                value={form.apa_format}
                onChange={on("apa_format")}
                placeholder="Author, A. A. (Year). Title. Journal…"
                rows={2}
              />
            </Field>
            <Field>
              <Lbl text="Abstract" />
              <textarea
                className="rdb-textarea"
                value={form.publication_abstract}
                onChange={on("publication_abstract")}
                placeholder="Enter abstract…"
                rows={4}
              />
            </Field>
            <Field>
              <Lbl text="Keywords" />
              <input
                className="rdb-input"
                type="text"
                value={form.publication_keywords}
                onChange={on("publication_keywords")}
                placeholder="e.g. deep learning, image segmentation"
              />
            </Field>
          </Card>
        )}

        {/* ── Submit ── */}
        <div className="rdb-submit-row">
          <button
            type="button"
            className="rdb-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit Record"}
          </button>
          {status.msg && (
            <div className={`rdb-status ${status.type}`}>{status.msg}</div>
          )}
        </div>

      </div>
    </div>
  );
}
