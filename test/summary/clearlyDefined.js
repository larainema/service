// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const chai = require('chai')
const definitionSchema = require('../../schemas/definition')
const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })
const { expect } = chai
const Summarizer = require('../../providers/summary/clearlydefined')
const { setIfValue } = require('../../lib/utils')
const EntityCoordinates = require('../../lib/entityCoordinates')

describe('ClearlyDefined Maven summarizer', () => {
  it('handles with all the data', () => {
    const { coordinates, harvested } = setupMaven('2018-03-06T11:38:10.284Z')
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described.releaseDate).to.eq('2018-03-06')
  })

  it('handles no data', () => {
    const { coordinates, harvested } = setupMaven()
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described).to.be.undefined
  })
})

function setupMaven(releaseDate) {
  const coordinates = EntityCoordinates.fromString('maven/mavencentral/io.clearlydefined/test/1.0')
  const harvested = {}
  setIfValue(harvested, 'releaseDate', releaseDate)
  return { coordinates, harvested }
}

describe('ClearlyDefined NuGet summarizer', () => {
  it('handles with all the data', () => {
    const { coordinates, harvested } = setupNuGet('2018-03-06T11:38:10.284Z')
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described.releaseDate).to.eq('2018-03-06')
  })

  it('handles no data', () => {
    const { coordinates, harvested } = setupNuGet()
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described).to.be.undefined
  })
})

function setupNuGet(releaseDate) {
  const coordinates = EntityCoordinates.fromString('nuget/nuget/-/test/1.0')
  const harvested = {}
  setIfValue(harvested, 'releaseDate', releaseDate)
  return { coordinates, harvested }
}

describe('ClearlyDefined Source Archive summarizer', () => {
  it('handles with all the data', () => {
    const { coordinates, harvested } = setupSourceArchive('2018-03-06T11:38:10.284Z')
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described.releaseDate).to.eq('2018-03-06')
  })

  it('handles no data', () => {
    const { coordinates, harvested } = setupSourceArchive()
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described).to.be.undefined
  })
})

function setupSourceArchive(releaseDate) {
  const coordinates = EntityCoordinates.fromString('sourcearchive/github/-/test/1.0')
  const harvested = {}
  setIfValue(harvested, 'releaseDate', releaseDate)
  return { coordinates, harvested }
}

describe('ClearlyDefined NPM summarizer', () => {
  it('handles with all the data', () => {
    const { coordinates, harvested } = setupNpm('2018-03-06T11:38:10.284Z', 'MIT', 'http://homepage', {
      url: 'http://bugs',
      email: 'bugs@test.com'
    })
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed.declared).to.eq('MIT')
    expect(summary.described.releaseDate).to.eq('2018-03-06')
    expect(summary.described.issueTracker).to.eq('http://bugs')
    expect(summary.described.projectWebsite).to.eq('http://homepage')
  })

  it('handles no data', () => {
    const { coordinates, harvested } = setupNpm()
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described).to.be.undefined
  })

  it('handles only releaseDate', () => {
    const { coordinates, harvested } = setupNpm('2018-03-06T11:38:10.284Z')
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described.releaseDate).to.eq('2018-03-06')
    expect(summary.described.issueTracker).to.be.undefined
    expect(summary.described.projectWebsite).to.be.undefined
  })

  it('handles string issueTracker', () => {
    const { coordinates, harvested } = setupNpm(null, null, null, 'http://bugs')
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described.releaseDate).to.be.undefined
    expect(summary.described.issueTracker).to.eq('http://bugs')
    expect(summary.described.projectWebsite).to.be.undefined
  })

  it('handles non url string issueTracker', () => {
    const { coordinates, harvested } = setupNpm(null, null, null, 'bugs@test.com')
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described).to.be.undefined
  })

  it('handles object license', () => {
    const { coordinates, harvested } = setupNpm(null, { type: 'MIT' })
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed.declared).to.eq('MIT')
    expect(summary.described).to.be.undefined
  })
})

function setupNpm(releaseDate, license, homepage, bugs) {
  const registryData = {}
  setIfValue(registryData, 'releaseDate', releaseDate)
  setIfValue(registryData, 'manifest.license', license)
  setIfValue(registryData, 'manifest.homepage', homepage)
  setIfValue(registryData, 'manifest.bugs', bugs)
  const harvested = { registryData }
  const coordinates = EntityCoordinates.fromString('npm/npmjs/-/test/1.0')
  return { coordinates, harvested }
}

describe('ClearlyDefined Gem summarizer', () => {
  it('handles with all the data', () => {
    const { coordinates, harvested } = setupGem('2018-03-06T11:38:10.284Z', 'MIT')
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed.declared).to.eq('MIT')
    expect(summary.described.releaseDate).to.eq('2018-03-06')
  })

  it('handles no data', () => {
    const { coordinates, harvested } = setupGem()
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described).to.be.undefined
  })
})

function setupGem(releaseDate, license) {
  const coordinates = EntityCoordinates.fromString('gem/rubygems/-/test/1.0')
  const harvested = {}
  setIfValue(harvested, 'releaseDate', releaseDate)
  setIfValue(harvested, 'licenses', license)
  return { coordinates, harvested }
}

describe('ClearlyDefined Pypi summarizer', () => {
  it('handles with all the data', () => {
    const { coordinates, harvested } = setupPypi('2018-03-06T11:38:10.284Z', 'MIT')
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed.declared).to.eq('MIT')
    expect(summary.described.releaseDate).to.eq('2018-03-06')
  })

  it('handles no data', () => {
    const { coordinates, harvested } = setupPypi()
    const summary = Summarizer().summarize(coordinates, harvested)
    validate(summary)
    expect(summary.licensed).to.be.undefined
    expect(summary.described).to.be.undefined
  })
})

function setupPypi(releaseDate, license) {
  const coordinates = EntityCoordinates.fromString('pypi/pypi/-/test/1.0')
  const harvested = {}
  setIfValue(harvested, 'releaseDate', releaseDate)
  setIfValue(harvested, 'declaredLicense', license)
  return { coordinates, harvested }
}

function validate(definition) {
  // Tack on a dummy coordinates to keep the schema happy. Tool summarizations do not have to include coordinates
  if (!definition.coordinates)
    definition.coordinates = { type: 'npm', provider: 'npmjs', namespace: null, name: 'foo', revision: '1.0' }
  if (!ajv.validate(definitionSchema, definition)) throw new Error(ajv.errorsText())
}
