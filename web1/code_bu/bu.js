// URL: https://beta.observablehq.com/@robinl/wcsv_meta-dct-title/2
// Title: ${wcsv_meta["dct:title"]}
// Author: Robin Linacre (@robinl)
// Version: 237
// Runtime version: 1

const m0 = {
  id: "5d32f93584355a72@237",
  variables: [
    {
      name: "title",
      inputs: ["md","wcsv_meta"],
      value: (function(md,wcsv_meta){return(
md `## ${wcsv_meta["dct:title"]}`
)})
    },
    {
      name: "viewof csv_url",
      inputs: ["radio"],
      value: (function(radio){return(
radio({
  title: "Full dataset (wait 20 seconds after selecting, might crash!) or small dataset?",
  options: [ { label: 'Smaller', value: "https://raw.githubusercontent.com/RobinL/ons_api_tests/master/smaller.csv" },{ label: 'Full', value: "https://download.beta.ons.gov.uk/downloads/datasets/mid-year-pop-est/editions/time-series/versions/4.csv" }, { label: 'Full from Github', value: "https://raw.githubusercontent.com/RobinL/ons_api_tests/master/data.csv" }],
  value: "https://raw.githubusercontent.com/RobinL/ons_api_tests/master/smaller.csv"
})
)})
    },
    {
      name: "csv_url",
      inputs: ["Generators","viewof csv_url"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof selected_granularity",
      inputs: ["select"],
      value: (function(select){return(
select({
  title: "Please select width of age bands:",
  options: [1,2,5,10],
  value: 5
})
)})
    },
    {
      name: "selected_granularity",
      inputs: ["Generators","viewof selected_granularity"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof selected_year",
      inputs: ["select","years"],
      value: (function(select,years){return(
select({
  title: "Please select year",
  options: years,
  value: 2017
})
)})
    },
    {
      name: "selected_year",
      inputs: ["Generators","viewof selected_year"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof selected_geography",
      inputs: ["select","geographies"],
      value: (function(select,geographies){return(
select({
  title: "Please select geography",
  options: geographies,
  value: "Hartlepool"
})
)})
    },
    {
      name: "selected_geography",
      inputs: ["Generators","viewof selected_geography"],
      value: (G, _) => G.input(_)
    },
    {
      name: "commentary",
      inputs: ["md","selected_geography","selected_year","d3","total_population"],
      value: (function(md,selected_geography,selected_year,d3,total_population){return(
md`The total population for ${selected_geography} in ${selected_year} was ${d3.format(",.0f")(total_population)}`
)})
    },
    {
      name: "pyramid",
      inputs: ["vega_embed","spec"],
      value: (function(vega_embed,spec){return(
vega_embed(spec)
)})
    },
    {
      name: "description",
      inputs: ["md","wcsv_meta"],
      value: (function(md,wcsv_meta){return(
md `${wcsv_meta["dct:description"]}`
)})
    },
    {
      name: "details",
      inputs: ["md","wcsv_meta"],
      value: (function(md,wcsv_meta){return(
md `Dataset issued ${Date(wcsv_meta["dct:issued"]).toString()}, contact ${wcsv_meta["dcat:contactPoint"][0]["vcard:email"]} for further details.  This is an ${wcsv_meta["dct:accrualPeriodicity"]} published dataset.`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Workings`
)})
    },
    {
      name: "df_raw",
      inputs: ["d3","csv_url"],
      value: (function(d3,csv_url){return(
d3.csv(csv_url, d3.autoType)
)})
    },
    {
      name: "df_for_chart",
      inputs: ["selected_geography","selected_year","_","df_raw"],
      value: (function(selected_geography,selected_year,_,df_raw)
{
  function my_filter(d) {
    
    let f1 = (d["geography"] == selected_geography)
    let f2 = (d["time"] == selected_year)
    let f3 = (d["age"] != "90+")
    let f4 = (d["age"] != "Total")
    let f5 = (d["sex"] == "Male" | d["sex"] == "Female")
   
    return f1 & f2 & f3 & f4 & f5

    
  }
  return _.filter(df_raw, my_filter)
}
)
    },
    {
      name: "geographies",
      inputs: ["_","df_raw"],
      value: (function(_,df_raw){return(
(_.map(_.uniqBy(df_raw, d => d.geography), d => d.geography)).sort()
)})
    },
    {
      name: "years",
      inputs: ["_","df_raw"],
      value: (function(_,df_raw){return(
(_.map(_.uniqBy(df_raw, d => d.time), d => d.time)).sort()
)})
    },
    {
      name: "total_population",
      inputs: ["_","df_raw","selected_geography","selected_year"],
      value: (function(_,df_raw,selected_geography,selected_year){return(
_.sumBy(_.filter(df_raw, d=> (d["geography"] == selected_geography && d["time"] == selected_year)), d=>d["V4_0"])
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3@^5.9")
)})
    },
    {
      name: "wcsv_meta",
      inputs: ["d3"],
      value: (function(d3){return(
d3.json("https://download.beta.ons.gov.uk/downloads/datasets/mid-year-pop-est/editions/time-series/versions/4.csv-metadata.json")
)})
    },
    {
      name: "spec",
      inputs: ["selected_granularity","selected_geography","selected_year","df_for_chart"],
      value: (function(selected_granularity,selected_geography,selected_year,df_for_chart)
{
  return {
    $schema: 'https://vega.github.io/schema/vega/v4.json',
    height: 1000/selected_granularity,
    padding: 5,
    signals: [{
        name: 'chartWidth',
        value: 300
    }, {
        name: 'chartPad',
        value: 20
    }, {
        name: 'width',
        update: '2 * chartWidth + chartPad'
    }
    ],
    title: {
        text: 'Population pyramid for ' + selected_geography + " in " + selected_year,
        anchor: 'start'
    },
    data: [{
        name: 'population',
        values: df_for_chart
    }, {
        name: 'popBinned',
        source: 'population',
        transform: [{
            type: 'bin',
            field: 'age',
            extent: [
                0,
                120
            ],
            step: selected_granularity,
            nice: true
        }, {
            type: 'aggregate',
            groupby: ['time', 'geography', 'sex', 'bin0'],
            ops: ['sum'],
            fields: ['V4_0']
        }]
    }, {
        name: 'popFiltered',
        source: 'popBinned',
        transform: [{
            type: 'filter',
            expr: 'datum.time == ' + selected_year
        },
                   {
            type: 'filter',
            expr: 'datum.geography == \''  + selected_geography + '\''
        }]
    }, {
        name: 'females',
        source: 'popFiltered',
        transform: [{
            type: 'filter',
            expr: 'datum.sex == \'Female\''
        }]
    }, {
        name: 'males',
        source: 'popFiltered',
        transform: [{
            type: 'filter',
            expr: 'datum.sex == \'Male\''
        }]
    }],
    scales: [{
        name: 'y',
        type: 'band',
        range: [{
                signal: 'height'
            },
            0
        ],
        round: true,
        domain: {
            data: 'popBinned',
            field: 'bin0',
            sort: true
        }
    }, {
        name: 'c',
        type: 'ordinal',
        domain: ['Male', 'Female'],
        range: ['#1f77b4', '#e377c2']
    }],
    marks: [{
        type: 'text',
        interactive: false,
        from: {
            data: 'popFiltered'
        },
        encode: {
            enter: {
                x: {
                    signal: 'chartWidth + chartPad / 2'
                },
                y: {
                    scale: 'y',
                    field: 'bin0',
                    band: 0.5
                },
                text: {
                    field: 'bin0'
                },
                baseline: {
                    value: 'middle'
                },
                align: {
                    value: 'center'
                },
                fill: {
                    value: '#000'
                }
            }
        }
    }, {
        type: 'group',
        encode: {
            update: {
                x: {
                    value: 0
                },
                height: {
                    signal: 'height'
                }
            }
        },
        scales: [{
            name: 'x',
            type: 'linear',
            range: [{
                    signal: 'chartWidth'
                },
                0
            ],
            nice: true,
            zero: true,
            domain: {
                data: 'popFiltered',
                field: 'sum_V4_0'
            }
        }],
        axes: [{
            orient: 'bottom',
            scale: 'x',
            format: 's'
        }],
        marks: [{
            type: 'rect',
            from: {
                data: 'females'
            },
            encode: {
                enter: {
                    x: {
                        scale: 'x',
                        field: 'sum_V4_0'
                    },
                    x2: {
                        scale: 'x',
                        value: 0
                    },
                    y: {
                        scale: 'y',
                        field: 'bin0'
                    },
                    height: {
                        scale: 'y',
                        band: 1,
                        offset: -1
                    },
                    fillOpacity: {
                        value: 0.6
                    },
                    fill: {
                        scale: 'c',
                        field: 'sex'
                    }
                }
            }
        }]
    }, {
        type: 'group',
        encode: {
            update: {
                x: {
                    signal: 'chartWidth + chartPad'
                },
                height: {
                    signal: 'height'
                }
            }
        },
        scales: [{
            name: 'x',
            type: 'linear',
            range: [
                0, {
                    signal: 'chartWidth'
                }
            ],
            nice: true,
            zero: true,
            domain: {
                data: 'popFiltered',
                field: 'sum_V4_0'
            }
        }],
        axes: [{
            orient: 'bottom',
            scale: 'x',
            format: 's'
        }],
        marks: [{
            type: 'rect',
            from: {
                data: 'males'
            },
            encode: {
                enter: {
                    x: {
                        scale: 'x',
                        field: 'sum_V4_0'
                    },
                    x2: {
                        scale: 'x',
                        value: 0
                    },
                    y: {
                        scale: 'y',
                        field: 'bin0'
                    },
                    height: {
                        scale: 'y',
                        band: 1,
                        offset: -1
                    },
                    fillOpacity: {
                        value: 0.6
                    },
                    fill: {
                        scale: 'c',
                        field: 'sex'
                    }
                }
            }
        }]
    }]
}}
)
    },
    {
      from: "@robinl/imports",
      name: "datatable",
      remote: "datatable"
    },
    {
      from: "@robinl/imports",
      name: "vega_embed",
      remote: "vega_embed"
    },
    {
      from: "@robinl/imports",
      name: "_",
      remote: "_"
    },
    {
      from: "@robinl/imports",
      name: "rdo",
      remote: "rdo"
    },
    {
      from: "@jashkenas/inputs",
      name: "radio",
      remote: "radio"
    },
    {
      from: "@jashkenas/inputs",
      name: "slider",
      remote: "slider"
    },
    {
      from: "@jashkenas/inputs",
      name: "checkbox",
      remote: "checkbox"
    },
    {
      from: "@jashkenas/inputs",
      name: "select",
      remote: "select"
    }
  ]
};

const m1 = {
  id: "@robinl/imports",
  variables: [
    {
      name: "datatable",
      inputs: ["requireFromGithub"],
      value: (function(requireFromGithub){return(
requireFromGithub("https://raw.githubusercontent.com/RobinL/open_data_munge/a6c4a2dfe7d9dc546ea43ec3a828f59faa189c1e/build/open-data-munge.js")
)})
    },
    {
      name: "vega_embed",
      inputs: ["require"],
      value: (function(require){return(
require("vega-embed@3")
)})
    },
    {
      name: "_",
      inputs: ["require"],
      value: (function(require){return(
require("lodash")
)})
    },
    {
      name: "rdo",
      inputs: ["requireFromGithub"],
      value: (function(requireFromGithub){return(
requireFromGithub('https://raw.githubusercontent.com/RobinL/rdo_code/f790d3add3e2f8dbcac81dccce6b364a2df5b587/build/rdo_code.js')
)})
    },
    {
      from: "@bumbeishvili/fetcher",
      name: "requireFromGithub",
      remote: "requireFromGithub"
    }
  ]
};

const m2 = {
  id: "@bumbeishvili/fetcher",
  variables: [
    {
      name: "requireFromGithub",
      inputs: ["require"],
      value: (function(require){return(
async function requireFromGithub(jsFileUrl,prop){
  const response = await fetch(jsFileUrl);
  const blob = await response.blob();
  return require(URL.createObjectURL(blob)).catch(() => {return window[prop]});
}
)})
    }
  ]
};

const m3 = {
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "radio",
      inputs: ["input","html"],
      value: (function(input,html){return(
function radio(config = {}) {
  let { value: formValue, title, description, submit, options } = config;
  if (Array.isArray(config)) options = config;
  options = options.map(
    o => (typeof o === "string" ? { value: o, label: o } : o)
  );
  const form = input({
    type: "radio",
    title,
    description,
    submit,
    getValue: input => {
      const checked = Array.prototype.find.call(input, radio => radio.checked);
      return checked ? checked.value : undefined;
    },
    form: html`
      <form>
        ${options.map(({ value, label }) => {
          const input = html`<input type=radio name=input ${
            value === formValue ? "checked" : ""
          } style="vertical-align: baseline;" />`;
          input.setAttribute("value", value);
          const tag = html`
          <label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
          return tag;
        })}
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "slider",
      inputs: ["input"],
      value: (function(input){return(
function slider(config = {}) {
  let {value, min = 0, max = 1, step = "any", precision = 2, title, description, getValue, format, display, submit} = config;
  if (typeof config == "number") value = config;
  if (value == null) value = (max + min) / 2;
  precision = Math.pow(10, precision);
  if (!getValue) getValue = input => Math.round(input.valueAsNumber * precision) / precision;
  return input({
    type: "range", title, description, submit, format, display,
    attributes: {min, max, step, value},
    getValue
  });
}
)})
    },
    {
      name: "checkbox",
      inputs: ["input","html"],
      value: (function(input,html){return(
function checkbox(config = {}) {
  let { value: formValue, title, description, submit, options } = config;
  if (Array.isArray(config)) options = config;
  options = options.map(
    o => (typeof o === "string" ? { value: o, label: o } : o)
  );
  const form = input({
    type: "checkbox",
    title,
    description,
    submit,
    getValue: input => {
      if (input.length)
        return Array.prototype.filter
          .call(input, i => i.checked)
          .map(i => i.value);
      return input.checked ? input.value : false;
    },
    form: html`
      <form>
        ${options.map(({ value, label }) => {
          const input = html`<input type=checkbox name=input ${
            (formValue || []).indexOf(value) > -1 ? "checked" : ""
          } style="vertical-align: baseline;" />`;
          input.setAttribute("value", value);
          const tag = html`<label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
          return tag;
        })}
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "select",
      inputs: ["input","html"],
      value: (function(input,html){return(
function select(config = {}) {
  let {
    value: formValue,
    title,
    description,
    submit,
    multiple,
    size,
    options
  } = config;
  if (Array.isArray(config)) options = config;
  options = options.map(
    o => (typeof o === "object" ? o : { value: o, label: o })
  );
  const form = input({
    type: "select",
    title,
    description,
    submit,
    getValue: input => {
      const selected = Array.prototype.filter
        .call(input.options, i => i.selected)
        .map(i => i.value);
      return multiple ? selected : selected[0];
    },
    form: html`
      <form>
        <select name="input" ${
          multiple ? `multiple size="${size || options.length}"` : ""
        }>
          ${options.map(({ value, label }) => Object.assign(html`<option>`, {
              value,
              selected: Array.isArray(formValue)
                ? formValue.includes(value)
                : formValue === value,
              textContent: label
            }))}
        </select>
      </form>
    `
  });
  form.output.remove();
  return form;
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {
    form,
    type = "text",
    attributes = {},
    action,
    getValue,
    title,
    description,
    format,
    display,
    submit,
    options
  } = config;
  if (!form)
    form = html`<form>
	<input name=input type=${type} />
  </form>`;
  const input = form.input;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) input.setAttribute(key, val);
  });
  if (submit)
    form.append(
      html`<input name=submit type=submit style="margin: 0 0.75em" value="${
        typeof submit == "string" ? submit : "Submit"
      }" />`
    );
  form.append(
    html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
  );
  if (title)
    form.prepend(
      html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`
    );
  if (description)
    form.append(
      html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`
    );
  if (format) format = d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit
      ? "onsubmit"
      : type == "button"
        ? "onclick"
        : type == "checkbox" || type == "radio"
          ? "onchange"
          : "oninput";
    form[verb] = e => {
      e && e.preventDefault();
      const value = getValue ? getValue(input) : input.value;
      if (form.output)
        form.output.value = display
          ? display(value)
          : format
            ? format(value)
            : value;
      form.value = value;
      if (verb !== "oninput")
        form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    };
    if (verb !== "oninput")
      input.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
    form[verb]();
  }
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format")
)})
    }
  ]
};

const notebook = {
  id: "5d32f93584355a72@237",
  modules: [m0,m1,m2,m3]
};

export default notebook;
